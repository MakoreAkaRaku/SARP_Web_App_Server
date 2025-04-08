import Elysia, {t, error} from "elysia"; 
import { registerModule, setModuleGroup, updateModuleAlias } from "../../data/module";
import { jwtMiddleware } from "../middleware/jwtMiddleware";
import { peripheral } from "./peripheral";
import { moduleMiddleware } from "../middleware/moduleMiddleware";

export const module = new Elysia({prefix: '/module'})
.post('/register', async ({body}) => {
      const { tokenAPI } = body
      const result = await registerModule(tokenAPI)
      if(!result.valid) {
        console.error("/module/register failed")
        return error(401, "This token has already expired or is not correct")
      }
      return Response.json({moduleToken: result.body},{status: 201})
    }
    ,
    {
      body: t.Object({
        tokenAPI: t.String({format: 'uuid'})
      })
    })
    .use(peripheral)
    .use(moduleMiddleware)
    .put('/alias', async ({body})=> {
      const result = await updateModuleAlias(body)
      if(!result.valid) {
        return error(401, result.body)
      }
      return Response.json({body: result.body},{status: 200})
    }, {
      body: t.Object({
        moduleUUID: t.String({format: "uuid"}),
        newAlias: t.String()
      }),
    })
    .put('/group',async ({body})=> {
      const moduleConfig = {moduleUUID : body.moduleUUID, groupID: body.groupID}
      const result  = await setModuleGroup(moduleConfig)

      if(!result.valid) {
        error(401, "UnAuthorized")
      }

      return new Response(null, {status: 200})
    }, {
      body: t.Object({
        moduleUUID: t.String({format:'uuid'}),
        groupID: t.Union([t.Integer(),t.Undefined()])
      })
    })