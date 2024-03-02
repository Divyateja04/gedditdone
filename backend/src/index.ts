// Source the env file
import 'dotenv/config'
import express, { Express } from 'express'
import session from 'express-session'
const cors = require('cors');
import { PORT, SESSIONKEY, __prod__ } from './constants'
// Middleware
import { loggerMiddleware } from './middleware/logger.middleware'
import { errorsMiddleware } from './middleware/error.middleware'
// Routes
import { helloRouter } from './routes/hello.route'
import { postsRouter } from './routes/posts.route'
import { gauthRouter } from './routes/gauth.route'
import { userRouter } from './routes/user.route'
import { validateMiddleware } from './middleware/auth.middleware';

const app: Express = express()

// Add middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    optionsSuccessStatus: 200,
    credentials: true,
    origin: "http://localhost:3000"
}))

// Add session middleware
declare module "express-session" {
    interface SessionData {
        email: string
    }
}
app.use(session({
    name: "geddit-session",
    store: new session.MemoryStore(),
    secret: SESSIONKEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: __prod__,
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
    },
}))
app.use(loggerMiddleware)
app.use(errorsMiddleware)


// Not validated routes
app.use("/oauth/google", gauthRouter)

// Validated routes
app.use(validateMiddleware)
app.use('/hello', helloRouter)
app.use('/post', postsRouter)
app.use('/user', userRouter)


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})