// Source the env file
import 'dotenv/config'
import express, { Express } from 'express'
import { PORT, SESSIONKEY } from './constants'
// Middleware
import { loggerMiddleware } from './middleware/logger.middleware'
import { errorsMiddleware } from './middleware/error.middleware'
// Routes
import { helloRouter } from './routes/hello.route'
import { postsRouter } from './routes/posts.route'
import session from 'express-session'
import { googleOAuthHandler } from './controllers/googleOAuthHandler.controller'

const app: Express = express()

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(loggerMiddleware)
app.use(errorsMiddleware)

// Add session storage
declare module "express-session" {
    interface SessionData {
        email: string
    }
}
app.use(session({
    secret: SESSIONKEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    },
}))

// Add routes
app.use('/hello', helloRouter)
app.use('/posts', postsRouter)
app.get("/api/sessions/oauth/google", googleOAuthHandler);


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})