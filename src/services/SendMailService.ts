import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import fs from 'fs'

export class SendMailService {
	private client: Transporter

	async createClient() {
		const account = await nodemailer.createTestAccount()

		const transporter = nodemailer.createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			auth: {
				user: account.user,
				pass: account.pass
			}
		})

		this.client = transporter
	}

	async execute(to: string, subject: string, variables: object, path: string) {
		await this.createClient()

		const templateFileContent = fs.readFileSync(path).toString("utf8")

		const mailTemplateParse = handlebars.compile(templateFileContent)

		const html = mailTemplateParse(variables)

		const message = await this.client.sendMail({
			to,
			subject,
			html,
			from: "NPS <noreply@nps.com.br>"
		})

		console.log('Message sent: %s', message.messageId)
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))

		return nodemailer.getTestMessageUrl(message)
	}
}
