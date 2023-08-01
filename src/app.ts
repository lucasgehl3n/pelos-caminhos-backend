
import http from 'http';
import express from "express";
import bodyParser from 'body-parser';
import routes from './routes';
import passport from 'passport';
import { databaseSync } from './database/sync';
import flash from 'connect-flash';
import expressSession from 'express-session';
import PassportManager from './middlewares/authentication/PassportManager';
import AuthenticationValidator from './middlewares/authentication/AuthenticationValidator';

class Application {
    server: http.Server;
    express: express.Application;

    constructor() {
        this.express = express();
        this.server = http.createServer(this.express);

        this._setSession();
        //this._setAclExpress();
        this._setMiddlewares();
        this._setRoutes();
        databaseSync();
    }

    private _setMiddlewares(): void {
        this.express.use(express.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(AuthenticationValidator);
    }

    private _setRoutes(): void {
        this.express.use(routes);
    }

    private _setSession(): void {
        this.express.use(expressSession({
            secret: 'xkACzfyIvmx8wEL?-Z9652ub?h61Ozu5/ag13mzSaXzuv--8EfCwUDTqT8QGtZGgYqzDcWguh8qqqGiQWqxMTx98PmRBFIk7CuuEos!JQ7N=vdhnl5jY9N6K20oQtbynxrvLhyBB7CACN99!xb7cQwt3MkMODuz=D!cryE?va5J-Htq=z5ZTYM3B8xbQxQyVsNHAZBWOjbBKW3wZSGyjOhu/cV-zLFyFhnSmLKY2Dter//Fe9nJ9cBJJVRTjW/pN',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
            },
        }));

        this.express.use(flash())
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        PassportManager.InitAuthenticateMethods(); 
    }

    // private _setAclExpress(): void {
    //     acl.config({
    //         rules: aclRules,
    //         baseUrl: '/',
    //         decodedObjectName: 'user',
    //         roleSearchPath: 'session.user.role',
    //         defaultRole: Perfil[Perfil.deslogado],
    //     });

       
    // }

    

}

export default new Application().server;