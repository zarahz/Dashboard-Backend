"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleapis_1 = require("googleapis");
const user_1 = require("../db/user");
const router = express_1.Router();
// client id : 3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com
// client secret : QS7LN2f6PXvhBHrOo1rdfLc6
function generateAuthClient(credentials = undefined) {
    const authClient = new googleapis_1.google.auth.OAuth2('3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com', 'QS7LN2f6PXvhBHrOo1rdfLc6', 'http://api.dashboard.zara/google/oauthcallback/');
    credentials && authClient.setCredentials(credentials);
    return authClient;
}
exports.generateAuthClient = generateAuthClient;
const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/user.birthday.read'
];
router.get('/login', (_req, res) => {
    const url = generateAuthClient().generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(302, url);
});
router.get('/oauthcallback', async (req, res) => {
    let code = req.query.code;
    const oauth2Client = generateAuthClient();
    const tokens = (await oauth2Client.getToken(code)).tokens;
    oauth2Client.setCredentials(tokens);
    const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = (await oauth2.userinfo.get()).data;
    const user = await setTokens(userInfo, tokens);
    req.session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
    return res.redirect(302, 'http://dashboard.zara');
});
async function setTokens(googleUser, tokens) {
    let dbUser;
    if (await user_1.userExists(googleUser.id)) {
        dbUser = await user_1.updateUserTokens(googleUser.id, tokens);
    }
    else {
        dbUser = await user_1.createUser(googleUser, tokens);
    }
    return dbUser;
}
exports.default = router;
//# sourceMappingURL=oauth.js.map