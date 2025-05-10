import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './database/schema'

import {configuration} from './configuration'

const postgress =  postgres(configuration.database.url);
export const db = drizzle({ client: postgress, schema });