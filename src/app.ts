
import http from 'http';
import express from "express";
import routes from './routes';
import passport from 'passport';
import { databaseSync } from './database/sync';
import flash from 'connect-flash';
import expressSession from 'express-session';
import PassportManager from './middlewares/authentication/PassportManager';
import AuthenticationValidator from './middlewares/authentication/AuthenticationValidator';
import cors from 'cors';
class Application {
    server: http.Server;
    express: express.Application;

    constructor() {
        this.express = express();
        this.server = http.createServer(this.express);

        this._setSession();
        this._setMiddlewares();
        this._setRoutes();
        databaseSync();
    }

    private _setMiddlewares(): void {
        this.express.use(cors({
            origin: process.env.FRONTEND_URL,
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            optionsSuccessStatus: 200
        }));

        this.express.use(function (req: any, res: any, next) {
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');

            if (req.method === "OPTIONS") {
                return res.status(200).end();
            } else {
                next();
            }
        });
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(AuthenticationValidator);
    }

    private _setRoutes(): void {
        this.express.use(routes);
    }

    private async _setSession(): Promise<void> {
        const addedSessionStore: any = {};
        this.express.use(expressSession({
            ...addedSessionStore,
            secret: 'xkACzfyIvmx8wEL?-Z9652ub?h61Ozu5/ag13mzSaXzuv--8EfCwUDTqT8QGtZGgYqzDcWguh8qqqGiQWqxMTx98PmRBFIk7CuuEos!JQ7N=vdhnl5jY9N6K20oQtbynxrvLhyBB7CACN99!xb7cQwt3MkMODuz=D!cryE?va5J-Htq=z5ZTYM3B8xbQxQyVsNHAZBWOjbBKW3wZSGyjOhu/cV-zLFyFhnSmLKY2Dter//Fe9nJ9cBJJVRTjW/pN',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60 * 60 * 24 * 30,
                domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_PUBLIC_DOMAIN : 'localhost',
            },
        }));

        this.express.use(flash())
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        PassportManager.InitAuthenticateMethods();
    }
}

export default new Application().server;