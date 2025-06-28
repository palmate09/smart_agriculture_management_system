import request from 'supertest'
import app from '../app.js'
import { expect } from 'chai'
import { describe } from 'mocha'
import client from '../config/database.js'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

describe.skip('Auth Routes', () => {

    const testClient = {
        username: 'aasutosh09', 
        password: '@Aashutosh09', 
        name: 'Aashutosh Barhate', 
        email: "palmateshubham9@gmail.com", 
        farm_names: 'the farm'
    }

    it('should signup the user ', async() => {
        const res = await request(app).post('/api/users/signup').send(testClient) 
        
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Signed up successfully')
    })

    it('should not allow duplicate signup', async() => {

         await request(app).post('/api/users/signup').send({
            username: 'aasutosh09', 
            password: '@Aashutosh09', 
            name: 'Aashutosh Barhate', 
            email: "palmateshubham9@gmail.com", 
            farm_names: 'the farm'
        })


         const res = await request(app).post('/api/users/signup').send({
            username: 'aasutosh09', 
            password: '@Aashutosh09', 
            name: 'Aashutosh Barhate', 
            email: "palmateshubham9@gmail.com", 
            farm_names: 'the farm'
        })

        expect(res.status).to.equal(400)
        expect(res.body.message).to.equal('User already exist please do login')
    })

    it('should login with correct credentials', async() => {

        const res = await request(app).post('/api/users/login').send({
            email: "palmateshubham9@gmail.com", 
            username: 'aasutosh09', 
            password : '@Aashutosh09'
        })

        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal('user successfully logged in')
    })

    it("should reject the wrong credentials", async() => {
        
        const res = await request(app).post('/api/users/login').send({
            username: 'wronguser',
            password: 'wrongpassword'
        });


        expect(res.status).to.equal(400); 
        expect(res.body.message).to.equal('User not found and authentication failed')
    })

    it("should get the user profile ", async() => {
        const token = jwt.sign({ email: 'palmateshubham9@gmail.com' }, "shubham09");

        const res = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${token}`)

        expect(res.status).to.equal(200); 
        expect(res.body.message).to.equal('user found')
    })

    it('update the user profile', async() => {
        const token = jwt.sign({email: 'palmateshubham9@gmail.com'}, 'shubham09')

        const res = await request(app).put('/api/users/update-profile').set('Authorization', `Bearer ${token}`).send({
            email: 'palmateshubham9@gmail.com', 
            username: 'aasutosh09', 
            name: 'Aashutosh Barhate', 
            farm_names: 'the farm'
        })

        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal('user found')
    })

    it('request for the forgot password', async() => {
        const token = jwt.sign({email: 'palmateshubham9@gmail.com'}, 'shubham09')

        const res = await request(app).post('/api/users/forgot-password').set('Authorization', `Bearer ${token}`).send({
            email: 'palmateshubham9@gmail.com'
        })

        expect(res.status).to.equal(200)
    })

    it('request after the authentication of user through email ', async() => {
        const token1 = jwt.sign({email: 'palmateshubham9@gmail.com'}, 'shubham09')

        const res = await request(app).post('/api/users/forgot-password/token').set('Authorization', `Bearer ${token1}`).send({
            token: randomBytes(32).toString('hex'),
            password: 'shubham09@'
        })

        expect(res.status).to.equal(200); 
    })

    after(async() => {
        
        await client.user.deleteMany({
            where: {
                email: testClient.email
            }
        })
    })    
})