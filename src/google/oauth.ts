import { Router } from "express";
import { google } from "googleapis";
import { userExists, updateUserTokens, createUser } from "../db/user";
import { Credentials, GoogleUser } from "../interfaces/user";

const router = Router();

// client id : 3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com
// client secret : QS7LN2f6PXvhBHrOo1rdfLc6

export function generateAuthClient(credentials: Credentials | undefined = undefined) {
    const authClient = new google.auth.OAuth2(
        '3512234566-bh3miuubr6l7aid8pb245nfvnuclpr9f.apps.googleusercontent.com',
        'QS7LN2f6PXvhBHrOo1rdfLc6',
        'http://api.dashboard.zara/google/oauthcallback/'
    );
    credentials && authClient.setCredentials(credentials);
    return authClient;
}

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/user.birthday.read'];

router.get('/login', (_req, res) => {
    const url = generateAuthClient().generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        scope: scopes
    });
    res.redirect(302, url)
})

router.get('/oauthcallback', async (req, res) => {
    let code: string = req.query.code as string;
    const oauth2Client = generateAuthClient()
    const tokens = (await oauth2Client.getToken(code)).tokens as Credentials

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });

    const userInfo = (await oauth2.userinfo.get()).data as GoogleUser;
    const user = await setTokens(userInfo, tokens);
    req.session!.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
    return res.redirect(302, 'http://dashboard.zara');
})

async function setTokens(googleUser: GoogleUser, tokens: Credentials) {
    let dbUser;
    if (await userExists(googleUser.id)) {
        dbUser = await updateUserTokens(googleUser.id, tokens)
    } else {
        dbUser = await createUser(googleUser, tokens)
    }
    return dbUser;
}



export default router;