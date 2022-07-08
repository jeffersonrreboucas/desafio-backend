const request = require('supertest');
const App = require('../index');
const { faker } = require('@faker-js/faker');

const { Users } = require('../models');
const { Posts } = require('../models');
const { Audios } = require('../models');

const cloudinary = require('../cloudinary');

describe( 'User route test', () => {
    test('should create a user', async () => {
        const user = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            password: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        }

        const { body, statusCode } = await request(App).post('/user').send(user);
        expect(body.name).toBe(user.name);
    });
});