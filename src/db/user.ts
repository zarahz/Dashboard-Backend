import { userRepository } from "./prisma";
import { Credentials, GoogleUser } from "../interfaces/user";

export async function createUser(user: GoogleUser, tokens: Credentials) {
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

export async function updateUserTokens(googleId: string, tokens: Credentials) {
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
        where: { googleId }
    })
}

export async function userExists(googleId: string) {
    const dbUser = await userRepository.findOne({
        where: { googleId }
    });
    return (dbUser) ? true : false;
}

export async function getUser(id: number) {
    const dbUser = await userRepository.findOne({
        where: { id },
        include: { googleCredentials: true }
    });
    return dbUser;
}
