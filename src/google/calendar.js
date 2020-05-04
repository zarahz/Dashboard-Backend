const { Router } = require("express");
const { google } = require('googleapis');
const { userMiddleware } = require('../middlewares');

const router = Router();

router.get("/caledar-events", userMiddleware, async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        //maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = result.data.items;
        if (events.length) {
            // console.log('Upcoming 10 events:');
            // events.map((event, i) => {
            //     const start = event.start.dateTime || event.start.date;
            //     console.log(`${start} - ${event.summary}`);
            // });
            res.status(200).send(events);
        } else {
            res.status(204);
        }
    });
})

module.exports = router;