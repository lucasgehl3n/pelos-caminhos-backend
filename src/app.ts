
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
        const corsOptions = {
            credentials: true,
            origin: function (origin: any, callback: any) {
                const allowedOrigins = ['http://localhost', 'http://localhost:3000', process.env.FRONTEND_URL];

                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: 'GET,PUT,POST,DELETE',
            allowedHeaders: 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization',
        };

        this.express.use(cors(corsOptions));

        // Middleware para lidar com preflight (solicitações OPTIONS)
        this.express.options('*', cors(corsOptions));
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
        this.express.use(express.json({ limit: '50mb' }));
        this.express.use(express.urlencoded({ limit: '50mb' }));

        PassportManager.InitAuthenticateMethods();
    }
}

export default new Application().server;