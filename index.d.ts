import User from "./src/database/models/User";
import session from 'express-session';

declare module 'express-session' {
    export interface SessionData {
        passport: {
            user: string,
        }
    }
}

interface AuthenticatedRequest extends Request {
    user?: User;
    isAuthenticated: () => boolean;
    role: string;
}
