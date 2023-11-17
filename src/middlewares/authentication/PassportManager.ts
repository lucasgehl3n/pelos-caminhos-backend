import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import UserService from "../../services/UserService";
import bcrypt from 'bcryptjs';
export default class PassportManager {
    static async InitAuthenticateMethods() {
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            const user = await UserService.GetByEmail(email);
            if (user) {
                bcrypt.compare(password, user.encriptedPassword, (err, res) => {
                    if (res || err) {
                        this.SerializeUser();
                        this.DeserializeUser();
                        done(null, user);
                    } else {
                        return done(null, false, { message: 'Credenciais inválidas!' });
                    }
                });
            }
        }));
    }

    static SerializeUser() {
        passport.serializeUser((user: any, done) => {
            done(null, user.id);
        });
    }

    static DeserializeUser() {
        passport.deserializeUser(async (id: number, done) => {
            const user = await UserService.GetByIdWithRoles(id);
            done(null, user);
        });
    }
}