// name of the module you are testing suffexed with .test. It will add a flask iconn. It reruns the test automatically as we are in watchAll mode. It found a test suite as we now have a test file. But then the file is first created it will fail because no test have been written. Looks similar to Vitest and that is based on JEST. Because you are using JS on both ends of the equation you can use the same tools which provides consistency. This leads to less cognative load for developers and more efficincy. 
import app from './app.js'
import request from 'supertest'

describe("App tests", () => {
    it('GET homepage', async() => {
        const res = await request(app).get('/') // pass in the app so it knows which app to configure and masquarate as a network request to. This is a get request to the homepage. Capture the response that comes back. This is the same as what postman does. We are programatically doing the same thing as a get request to the homepage in Postman. 
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8') // do this before you check the body. Fail the test if the API didn't return JSON.
        expect(res.body.info).toBeDefined() // My body contains an info key. Assert that the key must exsist. Telling other developers that it must exsit. 
        expect(res.body.info).toBe('Journal API 2023')
    })

    describe('GET /categories', () => {
        let res

        beforeEach(async() => {           
            res = await request(app).get('/categories') // pass in the app so it knows which app to configure and masquarate as a network request to. This is a get request to the homepage. Capture the response that comes back. This is the same as what postman does. We are programatically doing the same thing as a get request to the homepage in Postman. 
            expect(res.status).toBe(200)
            expect(res.headers['content-type']).toMatch(/json/i) // do this before you check the body. Fail the test if the API didn't return JSON. toBe requires it to match exactly. There is an option for a substring. /i means it is case insensitive. 
        })

        it('Should return an array of 4 elements', () => {
            expect(res.body).toBeInstanceOf(Array) // We expect the entire response body to be an array. 
            expect(res.body.length).toBe(5) // we know there are 5 elements so we should check the length is 5. Length is an attrbiute rather than a method of an array. 
        })
        it('Has an element with the correct data structure', () => {
            res.body.forEach(el => {
                expect(el._id).toBeDefined() // cant test the content of this element because the id changes when the database is reseeded. 
                expect(el.name).toBeDefined()
                expect(el._id.length).toBe(24)
        })
        expect(res.body[0].name).toBe('Food')
    })
    })

    test('Create a new entry', async () => {
        const res = await request(app).post('/entries').send({
            category: 'Work',
            content: 'Jest Testing'
        }) 
    // expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i) 
    expect(res.body._id).toBeDefined()
    expect(res.body.content).toBeDefined()
    expect(res.body.category.name).toBeDefined()
    expect(res.body.content).toBe('Jest Testing')

    })
})

        // expect(res.bodyl = res.body[0]
        // expect(el._id).toBeDefined() // cant test the content of this element because the id changes when the database is reseeded. 
        // expect(el.name).toBeDefined()
        // expect(el._id.length).toBe(24)
        // expect(el.name).toBe('Food')

    
