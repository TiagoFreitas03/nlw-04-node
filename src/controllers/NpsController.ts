import { Request, Response } from 'express'
import { IsNull, Not } from 'typeorm'

import { connection } from '../database'
import { SurveyUser } from '../models/SurveyUser'

export class NpsController {
	async execute(request: Request, response: Response) {
		const {survey_id} = request.params

		const surveysUsersRepository = connection.getRepository(SurveyUser)

		const surveysUsers = await surveysUsersRepository.find({
			where: {
				survey_id,
				value: Not(IsNull())
			}
		})

		const detractor = surveysUsers.filter((survey) => {
			return survey.value >= 0 && survey.value <= 6
		}).length

		const promoters = surveysUsers.filter((survey) => {
			return survey.value >= 9 && survey.value <= 10
		}).length

		const passive = surveysUsers.filter((survey) => {
			return survey.value >= 7 && survey.value <= 8
		}).length

		const totalAnswers = surveysUsers.length

		const calculate = Number((((promoters - detractor) / totalAnswers) * 100).toFixed(2))

		return response.json({
			detractor,
			promoters,
			passive,
			totalAnswers,
			nps: calculate,
		})
	}
}
