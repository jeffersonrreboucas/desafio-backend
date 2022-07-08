const { v4: uuidv4 } = require('uuid');
const env = require('dotenv').config();
const cloudinary = require("./cloudinary");
const express = require('express');
const router = express.Router();

const App = express();
const { Users } = require('./models');
const { Posts } = require('./models');
const { Audios } = require('./models');

const controllerLogin = require('./controllerLogin');
const { authMiddleware } = require('./authMiddleware');

const API_Key = process.env.API_KEY;
const secret = process.env.secret;

/* instanciando o passport, express-session e suas configurações */
const session = require('express-session');
const passport = require('passport');
const auth = require('./config/auth');
const { text } = require('express');
require('./config/auth')(passport);

App.use(session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 1000 }
}));

/* middleware */
let myLogger = function (req, res, next) {
    res.locals.Users = req.Users || null
    console.log('LOGGED')
    next();
}
App.use(myLogger);

App.use(express.json());

App.use(passport.initialize());
App.use(passport.session());
App.use(router);

/* ------ */ 

/* importação das credenciais de autenticação */ 
router.get('/login/success', controllerLogin.loginSuccess);
router.get('/login/failure', controllerLogin.loginFailure);
router.post('/login', controllerLogin.login);

App.post('/user', async (req, res) => {
    try {
        const body  = req.body;
        const user = await Users.create({
            name: body.name,
            email: body.email,
            password: body.password,
            isAdmin: body.isAdmin
        });

        res.status(201).send(user);
    } catch (error) {
        console.log('Error => ', error);
        res.status(500).send('deu merda');
    }
});

App.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).send(users);
    } catch (error) {
        console.log('Error => ', error);
        res.status(500).send('deu merda');
    }
});

App.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await Users.findByPk(userID);
        console.log(user);
        if (!user) return res.status(400).send('User not found');
        else if (user.isAdmin != true) return res.status(500).send('User is not Admin');
        else res.send(user);
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.put('/user/:id', authMiddleware, async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await Users.findByPk(userID);
        console.log(user);
        if (!user) return res.status(400).send('User not found');
        else {
            const body = req.body;
            user.name = body.name;
            user.email = body.email;
            user.password = body.password;
            user.isAdmin = body.isAdmin;
            await user.save();
            res.send(user);
        }
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.post('/text', authMiddleware, async (req, res) => {
    try {
        const text = req.body;
        const post = await Posts.create({
            title: text.title,
            subtitle: text.subtitle,
            text: text.text,
            userId: req.user.id
        });
        res.status(201).send(post);
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.put('/text/:id', authMiddleware, async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Posts.findByPk(postID);
        if (!post) return res.status(400).send('Post not found');
        else {
            const body = req.body;
            post.title = body.title;
            post.subtitle = body.subtitle;
            post.text = body.text;
            await post.save();
            res.send(post);
        }
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.get('/text/:id', authMiddleware, async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Posts.findByPk(postID);
        if (!post) return res.status(400).send('Post not found');
        else res.send(post);
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.get('/user/:id/texts', authMiddleware, async (req, res) => {
    try {
        const userID = req.user.id;
        const posts = await Posts.findAll({
            where: {
                userId: userID
            }
        });
        res.send(posts);
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.delete('/text/:id', authMiddleware, async (req, res) => {
    try {
        const postID = req.params.id;
        const post = await Posts.findByPk(postID);
        if (!post) return res.status(400).send('Post not found');
        else {
            await post.destroy();
            res.send(post);
        }
    } catch (error) {
        console.log('Error =>', error);
        res.status(500).send('deu merda');
    }
});

App.post('/text/:id/audio', authMiddleware, async (req, res) => {
    const postID = req.params.id;
    const post = await Posts.findByPk(postID);
    console.log(post);
    if (!post) return res.status(400).send('Post not found');
    else {
        const audio = await Audios.create({
            url: `http://api.voicerss.org/?key=${API_Key}&hl=pt-br&c=MP3&f=16khz_16bit_stereo&src=${post.text}`,
            postId: postID,
            userId: req.user.id
        });
        res.status(201).redirect(audio.url);
    }
});

if (process.env.NODE_ENV !== 'test') {
    App.listen(3000, () => {
        console.log('servidor rodando...');
    });
};

module.exports = App;