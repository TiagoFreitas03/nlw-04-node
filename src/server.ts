import { app } from './app'
import { connection } from './database'

app.listen(3333, async () => {
	await connection.initialize()
	console.log('App running on port 3333')
})
