import { User, GoogleCredentials } from "@prisma/client";
import { oauth2_v2, } from "googleapis";

declare global {
    namespace Express {
        interface Request {
            user?: User & {
                googleCredentials: GoogleCredentials | null;
            }
            googleClient: any
        }
    }
}