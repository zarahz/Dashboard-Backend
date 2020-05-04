const cookieSession = require('cookie-session')
const express = require('express')
const { userRepository } = require('./src/db/index')
const cors = require('cors')
const googleOauth = require('./src/google/oauth')
const googleCalendar = require('./src/google/calendar')


const app = express()
const port = 3000

/**
 * middlewares
 */
app.use(cors())
app.use(cookieSession({
    name: 'session',
    keys: ['M4cag6xMn8^key', 'AVD*x^uN4ekash'],
    domain: '.dashboard.zara',
    httpOnly: false,
}))

/**
 * routes
 */
app.use("/google", [googleOauth.router, googleCalendar])

app.get('/', (req, res) => {
    res.send((req.session.user) ? 'Hello No. ' + req.session.user : 'Hellooo!')
});


app.get("/users", async (req, res) => {
    const users = await userRepository.findMany();
    return res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    const user = await userRepository.findOne({
        where: { id: parseInt(id) },
        include: { googleCredentials: true }
    })
    return res.send(user);
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))