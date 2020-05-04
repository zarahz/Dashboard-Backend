const { Router } = require("express");
const { google } = require('googleapis');
const { userExists, updateUserTokens, createUser } = require('../db/user')

const router = Router();

// client id : 3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com
// client secret : QS7LN2f6PXvhBHrOo1rdfLc6

function generateAuthClient(credentials = undefined) {
    const authClient = new google.auth.OAuth2(
        '3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com',
        'QS7LN2f6PXvhBHrOo1rdfLc6',
        'http://api.dashboard.zara/google/oauthcallback/'
    );
    authClient.setCredentials(credentials);
    return authClient;
}

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/user.birthday.read'];

router.get('/login', (req, res) => {
    const url = generateAuthClient().generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        scope: scopes
    });
    res.redirect(302, url)
})

router.get('/oauthcallback', async (req, res) => {
    let code = req.query.code;
    const oauth2Client = generateAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });

    const userInfo = await oauth2.userinfo.get();
    await setTokens(req, userInfo.data, tokens);

    return res.redirect(302, 'http://dashboard.zara');
})

async function setTokens(req, user, tokens) {
    if (await userExists(user.id)) {
        const updatedUser = await updateUserTokens(user.id, tokens)
        req.session.user = {
            id: updatedUser.id,
            name: updatedUser.firstName
        }
    } else {
        const createdUser = await createUser(user, tokens)
        req.session.user = createdUser.id;
    }
}



module.exports = { router, generateAuthClient };