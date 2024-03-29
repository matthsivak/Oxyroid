import express from 'express'
import path from 'path'
import Logger from '../classes/Logger'
import Settings from '../classes/Settings'
import apiRouter from './routers/api'
import session from 'express-session'

const PORT = Settings.serverPort

const app = express()

app.use(express.json())
// Serve the React static files after build
app.use(express.static(path.resolve(__dirname, '..', '..', 'client', 'build')))
app.use(express.urlencoded({ extended: false }))
app.use(
	session({
		resave: false, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		secret: 'token123'
	})
)

// Api router
app.use('/api', apiRouter)

// Catch all other requests and serve the React app
app.use('*', (_req, res) => {
	res.sendFile(
		path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html')
	)
})

export default function start() {
	app.listen(PORT, () => {
		Logger.log(`Server listening on port ${PORT.toString()}`, 'INFO', 'SERVER')
	})
}
