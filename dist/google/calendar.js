"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleapis_1 = require("googleapis");
const middlewares_1 = require("../middlewares");
const router = express_1.Router();
router.get("/calendars", middlewares_1.userMiddleware, async (req, res) => {
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.calendarList.list({}, (err, result) => {
        if (err)
            return console.log('The API returned an error: ' + err);
        const calendars = result === null || result === void 0 ? void 0 : result.data.items;
        if (calendars && calendars.length > 0) {
            return res.status(200).send(calendars);
        }
        else {
            return res.status(204);
        }
    });
});
router.get("/primary-calendar-events", middlewares_1.userMiddleware, async (req, res) => {
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
        if (err)
            return console.log('The API returned an error: ' + err);
        const events = result === null || result === void 0 ? void 0 : result.data.items;
        if (events && events.length > 0) {
            return res.status(200).send(events);
        }
        else {
            return res.status(204);
        }
    });
});
router.get("/calendar-events/:calendarId", middlewares_1.userMiddleware, async (req, res) => {
    const { calendarId } = req.params;
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: req.googleClient });
    calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
        if (err)
            return console.log('The API returned an error: ' + err);
        const events = result === null || result === void 0 ? void 0 : result.data.items;
        if (events && events.length > 0) {
            return res.status(200).send(events);
        }
        else {
            return res.status(204);
        }
    });
});
exports.default = router;
//# sourceMappingURL=calendar.js.map