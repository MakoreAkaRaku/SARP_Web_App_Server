import { describe, expect, it, } from 'bun:test'
import { authentication } from '../../../src/api/authentication'

describe('Authentication endpoint', () => {

    it('should return 200 OK for a correct request', async () => {
        const correctRequest = new Request('http://localhost:3000/authentication/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Marc",
                surname: "Roman Colom",
                email: "marc@marc.com",
                password: '123456',
                passwordConfirmation: '123456'
            })
        })
        const response = await authentication.handle(correctRequest)
        expect(response.status).toBe(200)
    })

    it('should not return 200 OK for a passwords that don\'t match', async () => {
        const wrongRequest = new Request('http://localhost:3000/authentication/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Marc",
                surname: "Roman Colom",
                email: "marc@marc.com",
                password: '123456',
                passwordConfirmation: '123457'
            })
        })
        const response = await authentication.handle(wrongRequest)
        expect(response).not.toBe(200)
    })
})