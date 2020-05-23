import cookieSession from 'cookie-session'
import express from 'express'
import cors from 'cors'
import googleOauth from './google/oauth'
import googleCalendar from './google/calendar'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

/**
 * middlewares
 */
app.use(bodyParser.json())
app.use(cors({
    origin: [
        'http://dashboard.zara'
    ],
    credentials: true
}))
app.use(cookieSession({
    name: 'session',
    keys: ['M4cag6xMn8^key', 'AVD*x^uN4ekash'],
    domain: '.dashboard.zara',
    httpOnly: false,
}))

/**
 * routes
 */
app.use("/google", [googleOauth, googleCalendar])

app.get('/', (req, res) => {
    res.send((req.session?.user) ? `Hello ${req.session.name} (${req.session.id})` : 'Hellooo!')
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))