import Elysia, {t, error} from "elysia"
import { registerPeripheralSchema, registerPeripheral, getPeripheralData, registerPeripheralData , userHasOwnershipOfPeripheral, registerDataSchema } from "../data/peripheral"
import { randomId } from "elysia/utils"
import { hasAdminRole } from "../data/user"
import { jwtMiddleware } from "./middleware/jwtMiddleware"


export const peripheral = new Elysia({prefix: '/peripheral'})
.post('/', async ({body}) => {
  const newPeripheralData = {
    peripheral_type: body.peripheral_type, 
    short_descr:  (body.short_descr === undefined) ? body.peripheral_type+randomId(): body.short_descr,
    parent_module: body.parent_module 
  }

  const result = await registerPeripheral(newPeripheralData)
  if(!result.valid) {
    console.error("/peripheral registering failed")
    return error(401, "This token has already expired or is not correct")
  }
  return Response.json({ peripheralUUID: result.body }, { status: 201 })
}, {
  body: registerPeripheralSchema
})
.post('/:peripheral_id', async ({body, params : {peripheral_id}}) => {
  const smth = typeof false
  switch(typeof body.value) {
    case "boolean":
      if (body.data_type !== "boolean") {
        console.log("/periheral_id boolean check failed")
        return error(422, "Value type does not match data type")
      }
      break
    case "number":
      /**
       * Case 1: is a number without data_type being decimal or integer.
       * or
       * Case 2: is a number integer without data_type being integer.
      */
      if ( ( body.data_type !== "integer" && body.data_type !== "decimal") ||
        (Number.isInteger(body.value) && body.data_type !== "integer") ) {
          console.log("/periheral_id number check failed")
          return error(422, "Value type does not match data type")
      }
      break
    default:
      console.log("/periheral_id wrong data type introduced")
      return error(422, "Invalid data type")
  }
  const newDataRecord = {peripheral_id: peripheral_id, ...body}
  const peripheralData = await registerPeripheralData(newDataRecord)
  if(!peripheralData.valid) {
    console.error("/peripheral data query failed")
    return error(401, "This token has already expired or is not correct")
  }
  return Response.json({ peripheralData: peripheralData.body }, { status: 201 })
},
{
  params: t.Object({peripheral_id: t.Number()}),
  body: registerDataSchema
}
)
.use(jwtMiddleware)
.guard(
      {
        params: t.Object({
          peripheral_id: t.Number(),
        }),
        //Checking if the user has ownership of the peripheral or is an admin
        beforeHandle: async ({ jwtPayload, params }) => {
          const config = { userUUID: jwtPayload.uuid, peripheralID: params.peripheral_id }
          if (!hasAdminRole(jwtPayload)) {
            const hasOwnership = await userHasOwnershipOfPeripheral(config)
            if (!hasOwnership) return error(401)
          }
        }
      },
      (app) => app
      .get('/:peripheral_id', async ({body, params : {peripheral_id}}) => {
        const peripheralData = await getPeripheralData(peripheral_id,body)
        if(!peripheralData.valid) {
          console.error("/peripheral data query failed")
          return error(401, "This token has already expired or is not correct")
        }
        return Response.json({ peripheralData: peripheralData.body }, { status: 200 })
      },
      {
        body: t.Object({
            begin: t.Date({format: 'date-time'}),
            end: t.Date({format: 'date-time'})
          })
      })
)