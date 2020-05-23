"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_1 = require("../google/oauth");
const user_1 = require("../db/user");
exports.userMiddleware = async (req, res, next) => {
    var _a;
    const id = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) && req.session.user.id;
    if (!id) {
        return res.status(401).end();
    }
    const user = await user_1.getUser(id);
    if (!user) {
        return res.status(401).end();
    }
    req.user = user;
    if (user.googleCredentials) {
        const oauthClient = oauth_1.generateAuthClient({
            access_token: user.googleCredentials.accessToken,
            refresh_token: user.googleCredentials.refreshToken,
            scope: user.googleCredentials.scope,
            token_type: user.googleCredentials.tokenType,
            expiry_date: user.googleCredentials.expiryDate
        });
        await checkTokens(oauthClient, user);
        req.googleClient = oauthClient;
    }
    return next();
};
const checkTokens = async (oauthClient, user) => {
    //if (oauthClient.isTokenExpiring()) {
    const updatedOauthClient = await oauthClient.refreshAccessToken();
    //update db and set creds again
    await user_1.updateUserTokens(user.googleId, updatedOauthClient.credentials);
    //S}
};
//# sourceMappingURL=user.js.map