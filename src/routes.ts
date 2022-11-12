import { Router } from 'express'

import { UserController } from './controllers/UserController'
import { SurveyController } from './controllers/SurveyController'
import { SendMailController } from './controllers/SendMailController'
import { AnswerController } from './controllers/AnswerController'
import { NpsController } from './controllers/NpsController'

const router = Router()

const userController = new UserController()
const surveysController = new SurveyController()
const sendMailController = new SendMailController()
const answerController = new AnswerController()
const npsController = new NpsController()

router.get('/', (_req, res) => {
	return res.json({
		message: 'Next Level Week 4 - Trilha Node.js',
		app: 'API para cálculo de NPS',
		author: 'Tiago Faria'
	})
})

router.post("/users", userController.create)

router.post("/surveys", surveysController.create)
router.get("/surveys", surveysController.show)

router.post("/sendMail", sendMailController.execute)

router.get("/answers/:value", answerController.execute)

router.get("/nps/:survey_id", npsController.execute)

export { router }
