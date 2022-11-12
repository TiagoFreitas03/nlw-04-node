import 'dotenv/config'
import { Request, Response } from 'express'
import { resolve } from 'path'

import { connection } from '../database'
import { SendMailService } from '../services/SendMailService'
import { AppError } from '../errors/AppError'
import { User } from '../models/User'
import { Survey } from '../models/Survey'
import { SurveyUser } from '../models/SurveyUser'

export class SendMailController {
	async execute(request: Request, response: Response) {
		const { email, survey_id } = request.body

		const usersRepository = connection.getRepository(User)
		const surveysRepository = connection.getRepository(Survey)
		const surveysUsersRepository = connection.getRepository(SurveyUser)

		const user = await usersRepository.findOne({
			where: { email }
		})

		if (!user)
			throw new AppError("User does not exists")

		const survey = await surveysRepository.findOne({ where: { id: survey_id }})

		if (!survey)
			throw new AppError("Survey does not exists")

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

		const surveyUserExists = await surveysUsersRepository.findOne({
			where: { user_id: user.id, value: null },
			relations: ["user", "survey"],
		})

		const variables = {
			name: user.name,
			title: survey.title,
			description: survey.description,
			id: "",
			link: process.env.URL_MAIL
		}

		if (surveyUserExists) {
			variables.id = surveyUserExists.id

			const sendMailService = new SendMailService()
			const previewUrl = await sendMailService.execute(email, survey.title, variables, npsPath)

			return response.json({ surveyUserExists, previewUrl })
		}

		const surveyUser = surveysUsersRepository.create({
			user_id: user.id,
			survey_id
		})

		await surveysUsersRepository.save(surveyUser)

		variables.id = surveyUser.id

		const sendMailService = new SendMailService()
		const previewUrl = await sendMailService.execute(email, survey.title, variables, npsPath)

		return response.json({ surveyUser, previewUrl })
	}
}
