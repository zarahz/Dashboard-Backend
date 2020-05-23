import { Router } from "express";
import { google } from "googleapis";
import { userMiddleware } from "../middlewares";

const router = Router();

router.get("/calendars", userMiddleware, async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.calendarList.list({}, (err, result) => {
        if (err) return console.log('The API returned an error: ' + err);
        const calendars = result?.data.items;
        if (calendars && calendars.length > 0) {
            return res.status(200).send(calendars);
        } else {
            return res.status(204);
        }
    })
})

router.get("/primary-calendar-events", userMiddleware, async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = result?.data.items;
        if (events && events.length > 0) {
            return res.status(200).send(events);
        } else {
            return res.status(204);
        }
    });
})

router.get("/calendar-events/:calendarId", userMiddleware, async (req, res) => {
    const { calendarId } = req.params;
    const calendar = google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = result?.data.items;
        if (events && events.length > 0) {
            return res.status(200).send(events);
        } else {
            return res.status(204);
        }
    });
})

export default router;