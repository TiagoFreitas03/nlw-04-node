import express, { NextFunction, Request, Response } from 'express'
import 'reflect-metadata'
import "express-async-errors"

import { router } from "./routes"
import { AppError } from './errors/AppError'

const app = express()

app.use(express.json())
app.use(router)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			messsage: err.message
		})
	}

	return res.status(500).json({
		status: "Erro",
		message: `Internal Server Error: ${err.message}`
	})
})

export { app }
