"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const oauth_1 = __importDefault(require("./google/oauth"));
const calendar_1 = __importDefault(require("./google/calendar"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
const port = 3000;
/**
 * middlewares
 */
app.use(body_parser_1.default.json());
app.use(cors_1.default({
    origin: [
        'http://dashboard.zara'
    ],
    credentials: true
}));
app.use(cookie_session_1.default({
    name: 'session',
    keys: ['M4cag6xMn8^key', 'AVD*x^uN4ekash'],
    domain: '.dashboard.zara',
    httpOnly: false,
}));
/**
 * routes
 */
app.use("/google", [oauth_1.default, calendar_1.default]);
app.get('/', (req, res) => {
    var _a;
    res.send(((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) ? `Hello ${req.session.name} (${req.session.id})` : 'Hellooo!');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
//# sourceMappingURL=app.js.map