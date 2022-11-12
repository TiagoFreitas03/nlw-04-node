import { Request, Response } from 'express'

import { connection } from '../database'
import { Survey } from '../models/Survey'

export class SurveyController {
	async create(request: Request, response: Response) {
		const { title, description } = request.body

		const surveysRepository = connection.getRepository(Survey)

		const survey = surveysRepository.create({ title, description })

		await surveysRepository.save(survey)

		return response.status(201).json(survey)
	}

	async show(_req: Request, response: Response) {
		const surveysRepository = connection.getRepository(Survey)

		const all = await surveysRepository.find()

		return response.json(all)
	}
}
