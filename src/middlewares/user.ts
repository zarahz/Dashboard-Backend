import { generateAuthClient } from "../google/oauth";
import { updateUserTokens, getUser } from "../db/user";
import { RequestHandler } from "express";
import { User } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { Credentials } from "../interfaces/user";

export const userMiddleware: RequestHandler = async (req, res, next) => {
    const id = (req.session?.user) && req.session.user.id;
    if (!id) {
        return res.status(401).end();
    }
    const user = await getUser(id);
    if (!user) { return res.status(401).end(); }
    req.user = user;

    if (user.googleCredentials) {
        const oauthClient = generateAuthClient({
            access_token: user.googleCredentials.accessToken,
            refresh_token: user.googleCredentials.refreshToken,
            scope: user.googleCredentials.scope,
            token_type: user.googleCredentials.tokenType,
            expiry_date: user.googleCredentials.expiryDate
        });

        await checkTokens(oauthClient, user)
        req.googleClient = oauthClient;
    }

    return next();
}

const checkTokens = async (oauthClient: OAuth2Client, user: User) => {
    //if (oauthClient.isTokenExpiring()) {
    const updatedOauthClient = await oauthClient.refreshAccessToken();
    //update db and set creds again
    await updateUserTokens(user.googleId, updatedOauthClient.credentials as Credentials)
    //S}

}
