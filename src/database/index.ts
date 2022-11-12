import 'dotenv/config'
import { DataSource } from "typeorm"
import path from 'path'

const env = process.env.NODE_ENV
const database = env === 'test' ? 'database.test.sqlite' : 'database.sqlite'

export const connection = new DataSource({
	type: "sqlite",
  database: path.join(__dirname, database) ,
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  entities: [path.join(__dirname, '..', 'models', '*.ts')]
})
