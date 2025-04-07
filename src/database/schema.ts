import { serial, text, pgTable, integer, uuid, timestamp } from "drizzle-orm/pg-core";

export const userPermissions = ["admin","user","guest"]
export const peripheralTypes = []

export const permissions = pgTable('permission', {
    id: serial('id').notNull().primaryKey(),
    roleType: text('role_type').unique()
})

export const profile_pics = pgTable('profile_pic', {
    id: serial('id').notNull().primaryKey(),
    pic: text('pic_url').notNull(),
})

export const users = pgTable('user',{
    uuid: uuid('uuid').notNull().$defaultFn(()=> crypto.randomUUID()).primaryKey(),
    username: text('username').notNull().unique(),
    pwd: text('pwd').notNull(),
    email: text('email').notNull().unique(),
    permit_id: integer('permit_id').notNull().$defaultFn(()=> userPermissions.indexOf('user') + 1),
    registered_on: timestamp('registered_on').$defaultFn(()=> new Date()),
    profile_pic_id: integer('profile_pic_id').references(()=>profile_pics.id),
})

export const apiTokens = pgTable('api_token',{
    token_api: uuid('token_api').notNull().primaryKey(),
    user_uuid: uuid('user_uuid').notNull().references(()=>users.uuid),
})

export const groups = pgTable('group',{
    id: serial('id').notNull().primaryKey(),
    group_name: text('group_name').notNull(),
    owner_group: uuid('owner_group').notNull().references(()=>users.uuid),
})

export const modules = pgTable('module',{
    uuid: uuid('uuid').$defaultFn(()=> crypto.randomUUID()).primaryKey(),
    alias: text('alias').notNull().$defaultFn(()=> 'My fresh module'),
    token_api: uuid('token_api').notNull().references(()=>apiTokens.token_api),
    belong_group: integer('belong_group').references(()=>groups.id),
    last_seen: timestamp('last_seen'),
})

export const peripherals = pgTable('peripheral',{
    id: serial('id').primaryKey(),
    peripheral_type: text('peripheral_type').notNull(),
    parent_module: uuid('parent_module').notNull().references(()=>modules.uuid),
})

export const datas = pgTable('data',{
    id: serial('id').primaryKey(),
    peripheral_id: integer('peripheral_id').notNull().references(()=>peripherals.id),
    value: text('value').notNull(),
    register_date: timestamp('register_date').notNull().$defaultFn(()=> new Date()),
})

export const conditions = pgTable('condition',{
    rule_cond_id: serial('rule_cond_id').primaryKey(),
    rule_condition: text('rule_condition').notNull(),
})

export const rules = pgTable('rule',{
    id: serial('id').primaryKey(),
    rule_name: text('rule_name').notNull(),
    rule_type: text('rule_type').notNull(),
    condition_id: integer('condition_id').notNull().references(()=>conditions.rule_cond_id),
    peripheral_id: integer('peripheral_id').notNull().references(()=>peripherals.id),
})

export const notificationBodies = pgTable('notification_body',{
    id: serial('id').primaryKey(),
    body: text('body').notNull(),
})

export const notifications = pgTable('notification',{
    id: serial('id').primaryKey(),
    notification_type: text('notification_type').notNull(),
    notification_date: timestamp('notification_date').notNull().$defaultFn(()=> new Date()),
    description_id: integer('description_id').notNull().references(()=>notificationBodies.id),
    rule_id: integer('rule_id').notNull().references(()=>rules.id),
})
