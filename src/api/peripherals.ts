import Elysia, {t, error} from "elysia"
import { registerPeripheralSchema, registerPeripheral, getPeripheralData, registerPeripheralData , userHasOwnershipOfPeripheral, registerDataSchema, updatePeripheralSpecs, updatePeripheral } from "../data/peripheral"
import { randomId } from "elysia/utils"
import { hasAdminRole } from "../data/user"
import { jwtMiddleware } from "./middleware/jwtMiddleware"


export const peripheral = new Elysia({prefix: '/peripheral'})
.post('/', async ({body, set}) => {
  const newPeripheralData = {
    peripheral_type: body.peripheral_type, 
    short_descr:  (body.short_descr === undefined) ? body.peripheral_type+randomId(): body.short_descr,
    parent_module: body.parent_module 
  }

  const result = await registerPeripheral(newPeripheralData)
  if(!result.valid) {
    console.error("/peripheral registering failed")
    throw error(401, "This token has already expired or is not correct")
  }
  set.status = 201
  return result.body
}, {
  // response: , //TODO: Define the response schema
  detail: {
    description: 'Registers a new peripheral, returning the peripheral unique identifier (this endpoint is expecting to be called by a module)',
    tags: ['peripheral'],
  },
  body: registerPeripheralSchema
})
.post('/data', async ({body, set}) => {
  switch(typeof body.value) {
    case "boolean":
      if (body.data_type !== "boolean") {
        console.log("/periheral_id boolean check failed")
        throw error(422, "Value type does not match data type")
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
          throw error(422, "Value type does not match data type")
      }
      break
    default:
      console.log("/periheral_id wrong data type introduced")
      throw error(422, "Invalid data type")
  }
  const peripheralData = await registerPeripheralData(body)
  if(!peripheralData.valid) {
    console.error("/peripheral data query failed")
    throw error(401, "This token has already expired or is not correct")
  }
  set.status = 201
},{
  detail: {
    description: 'Registers a new data record for a peripheral (this endpoint is expecting to be called by a module)',
    tags: ['peripheral'],
  },
  body: registerDataSchema
}
)
.use(jwtMiddleware)
.guard(
      {
        params: t.Object({
          id: t.Number(),
        }),
        //Checking if the user has ownership of the peripheral or is an admin
        beforeHandle: async ({ jwtPayload, params }) => {
          const config = { userUUID: jwtPayload.uuid, peripheralID: params.id }
          if (!hasAdminRole(jwtPayload)) {
            const hasOwnership = await userHasOwnershipOfPeripheral(config)
            if (!hasOwnership) return error(401)
          }
        }
      },
      (app) => app
      .get('/:id', async ({body, params : {id}}) => {
        const peripheralData = await getPeripheralData(id,body)
        if(!peripheralData.valid) {
          console.error("/peripheral data query failed")
          throw error(401, "This token has already expired or is not correct")
        }

        return peripheralData.body
      }, {
        // response: //TODO: Define the response schema
        detail: {
          description: 'Get the data of a peripheral by its uuid',
          tags: ['peripheral'],
        },
        body: t.Object({
            begin: t.Date({format: 'date-time'}),
            end: t.Date({format: 'date-time'})
          })
      })
      .put('/', async ({body}) => {
        const result = await updatePeripheralSpecs(body)
        if(!result.valid) {
          console.error("/peripheral data registering failed")
          throw error(401, "This token has already expired or is not correct")
        }
        return result.body
      },
    {
        body: updatePeripheral,
        detail: {
          description: 'Updates a peripheral description',
          tags: ['peripheral'],
        }
    })
)