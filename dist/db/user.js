"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
async function createUser(user, tokens) {
    return await prisma_1.userRepository.create({
        data: {
            googleId: user.id,
            email: user.email,
            firstName: user.given_name,
            lastName: user.family_name,
            picture: user.picture,
            googleCredentials: {
                create: {
                    accessToken: tokens.access_token,
                    expiryDate: tokens.expiry_date,
                    refreshToken: tokens.refresh_token,
                    scope: tokens.scope,
                    tokenType: tokens.token_type
                }
            }
        }
    });
}
exports.createUser = createUser;
async function updateUserTokens(googleId, tokens) {
    return await prisma_1.userRepository.update({
        data: {
            googleCredentials: {
                update: {
                    accessToken: tokens.access_token,
                    expiryDate: tokens.expiry_date,
                    refreshToken: tokens.refresh_token,
                    scope: tokens.scope,
                    tokenType: tokens.token_type
                }
            }
        },
        where: { googleId }
    });
}
exports.updateUserTokens = updateUserTokens;
async function userExists(googleId) {
    const dbUser = await prisma_1.userRepository.findOne({
        where: { googleId }
    });
    return (dbUser) ? true : false;
}
exports.userExists = userExists;
async function getUser(id) {
    const dbUser = await prisma_1.userRepository.findOne({
        where: { id },
        include: { googleCredentials: true }
    });
    return dbUser;
}
exports.getUser = getUser;
//# sourceMappingURL=user.js.map