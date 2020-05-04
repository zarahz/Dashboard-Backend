const { userRepository } = require('./index')

async function createUser(user, tokens) {
    return await userRepository.create({
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
    })
}

async function updateUserTokens(id, tokens) {
    return await userRepository.update({
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
        where: { googleId: id }
    })
}

async function userExists(googleId) {
    const dbUser = await userRepository.findOne({
        where: { googleId }
    });
    return (dbUser) ? true : false;
}

async function getUser(id) {
    const dbUser = await userRepository.findOne({
        where: { id },
        include: { googleCredentials: true }
    });
    return dbUser;
}

module.exports = {
    updateUserTokens,
    createUser,
    userExists,
    getUser
}