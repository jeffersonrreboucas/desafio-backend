const { Users } = require('../models');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
        Users.findOne({ where: { email: email } }).then((user) => {
            if (!user) {
                return done(null, false, { msg: "Usuário não encontrado!" });
            }
            const res = bcrypt.compare(password, user.password, (error, resposta) => {
                if (resposta) {
                    return done(null, user);
                } else {
                    return done(null, false, { msg: "Erro ao logar!", error });
                }
            })
        });
    }));

    passport.serializeUser((user, done) => {
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }
        
        done(null, userSession);
    });

    passport.deserializeUser((userSession, done) => {
        done(null, userSession);
    });
}