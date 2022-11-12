import { Request, Response } from 'express'

import { connection } from '../database'
import { AppError } from '../errors/AppError'
import { SurveyUser } from '../models/SurveyUser'

export class AnswerController {
	async execute(request: Request, response: Response) {
		const { value } = request.params
		const { u } = request.query

		const surveysUsersRepository = connection.getRepository(SurveyUser)

		const surveyUser = await surveysUsersRepository.findOne({
			where: {
				id: String(u)
			}
		})

		if(!surveyUser)
			throw new AppError("Survey user does not exists!")

		surveyUser.value = Number(value)

		await surveysUsersRepository.save(surveyUser)

		return response.json(surveyUser)
	}
}
