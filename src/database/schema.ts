import { serial, text, pgTable, integer, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";

export const userPermissions = ["admin", "user", "guest"] as const
export const peripheralTypes = ["thermometer", "hygrometer", "valve", "other"] as const
export const dataTypes = ['boolean', 'decimal', 'integer'] as const
export const states = ['on', 'off', 'error'] as const
export const enum frecType {
  ONETIME=1,
  DAILY=4,
  WEEKLY=8,
  MONTHLY=16,
  MONTHLYREL=32,
}

export const enum frecInterval {
  NOUSE=1,
  DAYBYINTERVAL=4,
  BINARIALDAYS=8,         // "Binario: dias corresponden a bits. 1 = lunes, 2 = martes, 4 = miércoles, 8 = jueves, 16 = viernes, 32 = sábado, 64 = domingo",
  SPECIFICDAYOFMONTH=16,  // days range (1-31)
}

export const permissions = pgTable('permission', {
  id: serial('id').notNull().primaryKey(),
  roleType: text('role_type').unique()
})

export const profile_pics = pgTable('profile_pic', {
  id: serial('id').notNull().primaryKey(),
  pic: text('pic_url').notNull(),
})

export const users = pgTable('user', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  pwd: text('pwd').notNull(),
  email: text('email').notNull().unique(),
  permit_id: integer('permit_id').notNull().$defaultFn(() => userPermissions.indexOf('user') + 1).references(() => permissions.id),
  registered_on: timestamp('registered_on').notNull().defaultNow(),
  profile_pic_id: integer('profile_pic_id').references(() => profile_pics.id),
})

export const apiTokens = pgTable('api_token', {
  token_api: uuid('token_api').defaultRandom().primaryKey(),
  user_uuid: uuid('user_uuid').notNull().references(() => users.uuid),
})

export const groups = pgTable('group', {
  id: serial('id').notNull().primaryKey(),
  group_name: text('group_name').notNull(),
  owner_group: uuid('owner_group').notNull().references(() => users.uuid),
})

export const modules = pgTable('module', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  alias: text('alias').notNull().$defaultFn(() => 'My fresh module'),
  token_api: uuid('token_api').notNull().references(() => apiTokens.token_api),
  belong_group: integer('belong_group').references(() => groups.id),
  last_seen: timestamp('last_seen'),
})

export const pTypes = pgTable('peripheral_type', {
  type: text('type', {enum: peripheralTypes}).notNull().primaryKey(),
  data_type: text('data_type', { enum: dataTypes }).notNull(),
})

export const peripherals = pgTable('peripheral', {
  id: serial('id').primaryKey(),
  short_descr: text('short_descr'),
  p_type: text('p_type', { enum: peripheralTypes }).notNull().references(() => pTypes.type),
  parent_module: uuid('parent_module').notNull().references(() => modules.uuid),
})

export const peripheralStates = pgTable('peripheral_state', {
  peripheral_id: integer('peripheral_id').primaryKey().notNull().references(() => peripherals.id),
  state: text('state', { enum: states }).notNull().default("off"),
  last_modified: timestamp('last_modified').notNull().defaultNow()
})

export const datas = pgTable('data', {
  id: serial('id').primaryKey(),
  peripheral_id: integer('peripheral_id').notNull().references(() => peripherals.id),
  value: jsonb('value').notNull(),
  registered_at: timestamp('registered_at').notNull().defaultNow(),
})

export const schedules = pgTable('schedule', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  peripheral_id: integer('peripheral_id').notNull().references(() => peripherals.id),
  cron_expression: text('cron_expression').notNull(),
  last_run: timestamp('last_run')
})

export const notificationBodies = pgTable('notification_body', {
  id: serial('id').primaryKey(),
  body: text('body').notNull(),
})

export const notifications = pgTable('notification', {
  id: serial('id').primaryKey(),
  notification_type: text('notification_type').notNull(),
  notification_date: timestamp('notification_date').notNull().defaultNow(),
  description_id: integer('description_id').notNull().references(() => notificationBodies.id),
  peripheral_id: integer('peripheral_id').notNull().references(()=>peripherals.id)
})
