import { Request, Response } from 'express'
import * as yup from 'yup'

import { connection } from '../database'
import { User } from '../models/User'
import { AppError } from '../errors/AppError'

export class UserController {
	async create(request: Request, response: Response) {
		const { name, email } = request.body

		const schema = yup.object().shape({
			name: yup.string().required(),
			email: yup.string().email().required(),
		})

		try {
			await schema.validate(request.body, {abortEarly: false})
		} catch (err) {
			throw new AppError(err)
		}

		const usersRepository = connection.getRepository(User)

		const userAlreadyExists = await usersRepository.findOne({
			where: { email }
		})

		if (userAlreadyExists) {
			throw new AppError("User already exists!")
		}

		const user = usersRepository.create({
			name, email
		})

		await usersRepository.save(user)

		return response.status(201).json(user)
	}
}
