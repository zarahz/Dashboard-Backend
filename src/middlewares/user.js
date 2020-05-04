
const { generateAuthClient } = require('../google/oauth')
const { updateUserTokens, getUser } = require('../db/user');

const userMiddleware = async (req, res, next) => {
    const id = req.session.user;
    if (!id) {
        return res.status(401).end();
    }
    const user = await getUser(id);

    console.log(user.googleCredentials);
    req.user = user;
    const oauthClient = generateAuthClient({
        access_token: user.googleCredentials.accessToken,
        refresh_token: user.googleCredentials.refreshToken,
        scope: user.googleCredentials.scope,
        token_type: user.googleCredentials.tokenType,
        expiry_date: user.googleCredentials.expiryDate
    });

    await checkTokens(oauthClient, user)

    req.googleClient = oauthClient;
    next();
}

const checkTokens = async (oauthClient, user) => {
    if (oauthClient.isTokenExpiring()) {
        const updatedOauthClient = await oauthClient.refreshAccessToken();
        console.log(test);
        //update db and set creds again
        await updateUserTokens(user.id, updatedOauthClient.credentials)
    }

}

module.exports = userMiddleware;