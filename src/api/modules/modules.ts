import Elysia from "elysia";

export const module = new Elysia({prefix: '/modules'})
.get('/register', ({request}) =>
    {

        console.log(request.headers.get('auth'))
        console.log('Hola')

        return Response.json({
            asdasd: 'asdasd'
        })
    }

//TODO:
        // if(checkUserToken(body.userToken)){

        // } else return Response.json("Permission Denied", {status: 403})
        
)