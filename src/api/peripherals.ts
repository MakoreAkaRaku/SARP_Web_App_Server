import Elysia, { t, error } from "elysia"
import { registerPeripheralSchema, registerPeripheral, getPeripheralData, registerPeripheralData, userHasOwnershipOfPeripheral, registerDataSchema, updatePeripheralSpecs, updatePeripheral, getPeripheralDataType, selectPeripheralSchema, getPeripheralState } from "../data/peripheral"
import { randomId } from "elysia/utils"
import { hasAdminRole } from "../data/user"
import { jwtMiddleware } from "./middleware/jwtMiddleware"


export const peripheral = new Elysia({ prefix: '/peripheral' })
  .get("/state/:peripheral_id", async ({ params }) => {
    const result = await getPeripheralState(params.peripheral_id)
    if (!result.valid) {
      return error(400, result.body)
    }

    return { state: result.body.state }
  }, {
    detail: {
      description: "Returns the state of the peripheral. This endpoint is only meant for the activational peripherals.",
      tags: ["peripheral"]
    },
    response: {
      400: t.String(),
      200: t.Object({
        state: t.String()
      })
    },
    params: t.Object({
      peripheral_id: t.Numeric()
    })
  })
  .post('/', async ({ body, set }) => {
    const newPeripheralData = {
      p_type: body.p_type,
      short_descr: (body.short_descr === undefined) ? body.p_type + randomId() : body.short_descr,
      parent_module: body.parent_module
    }

    const result = await registerPeripheral(newPeripheralData)
    if (!result.valid) {
      console.error("/peripheral registering failed")
      throw error(401, "This token has already expired or is not correct")
    }
    set.status = 201
    return {id: result.body.id}
  }, {
    detail: {
      description: 'Registers a new peripheral, returning the peripheral unique identifier (this endpoint is expecting to be called by a module)',
      tags: ['peripheral'],
    },
    body: registerPeripheralSchema,
    response: t.Object({
      id: t.Number()
    })
  })
  .post('/data', async ({ body, set }) => {
    const peripheral = await getPeripheralDataType({ id: body.peripheral_id })
    if (!peripheral)
      throw error(404)
    switch (typeof body.value) {
      case "boolean":
        if (peripheral.data_type !== "boolean") {
          console.error("/periheral_id boolean check failed")
          throw error(422, "Value type does not match data type")
        }
        break
      case "number":
        /**
         * Case 1: is a number without data_type being decimal or integer.
         * or
         * Case 2: is a number integer without data_type being integer.
        */
        if ((peripheral.data_type !== "integer" && peripheral.data_type !== "decimal") ||
          (Number.isInteger(body.value) && peripheral.data_type !== "integer")) {
          console.error("/periheral_id number check failed")
          throw error(422, "Value type does not match data type")
        }
        break
      default:
        console.error("/periheral_id default error check type")
        throw error(422, "Invalid data type")
    }
    const peripheralData = await registerPeripheralData(body)
    if (!peripheralData.valid) {
      console.error("/peripheral data query failed")
      throw error(401, "This token has already expired or is not correct")
    }
    set.status = 201
  }, {
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
      .get('/:id', async ({ query, params: { id } }) => {
        console.log("Get data peripheral -", id, query)
        const peripheralData = await getPeripheralData(id, query)
        if (!peripheralData.valid) {
          console.error("/peripheral data query failed")
          throw error(401, "This token has already expired or is not correct")
        }

        return peripheralData.body
      }, {
        detail: {
          description: 'Returns a timelapse of data between begin and end dates. Dates can be in whatever format',
          tags: ['peripheral'],
        },
        response: t.Object({
          peripheral: t.Optional(
            t.Object({
              id: t.Number(),
              short_descr: t.Union([t.Null(), t.String()]),
              p_type: t.Union([
                t.Literal('hygrometer'),
                t.Literal('thermometer'),
                t.Literal('valve'),
                t.Literal('other')]
              ),
              parent_module: t.String(),
            })
          ),
          data: t.Object({
            dates: t.Array(t.Date()),
            values: t.Array(t.Unknown())
          })
        }),
        query: t.Optional(
          t.Object({
            begin: t.Date({
              format: 'date-time'
            }),
            end: t.Date({
              format: 'date-time',
            })
          })
        )
      })
      .put('/', async ({ body }) => {
        const result = await updatePeripheralSpecs(body)
        if (!result.valid) {
          console.error("/peripheral data update failed")
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