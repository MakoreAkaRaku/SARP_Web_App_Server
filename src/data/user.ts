import { error, t } from "elysia"
import { users } from "../database/schema"
import { db } from "../db"
import { eq } from "drizzle-orm"

export const userRegistrySchema = t.Object({
  uuid: t.String({ format: 'uuid' }),
  username: t.String({ minLength: 4 }),
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 }),
  passwordConfirmation: t.String({ minLength: 6 }),
  permit_id: t.Integer()
})

export const loginUserSchema = t.Object({
  username: t.String({ minLength: 4 }),
  pwd: t.String({ minLength: 6 })
})

export const updateUserSchema = t.Object({
  username: t.String({ minLength: 4 }),
  email: t.String({ format: 'email' }),
  pwd: t.String({ minLength: 6 })
})

export async function register(opts: {
    username: string,
    email: string,
    password: string
}) {
    const { username, email, password } = opts
    const hashedPwd = await Bun.password.hash(password, {
        algorithm: "bcrypt",
    });

    try {
        console.log(opts, {hashed: hashedPwd})
        const [row] = await db.insert(users).values(
            {
                username: username,
                pwd: hashedPwd,
                email: email,
            }
        ).returning()
        return  { ok: true, data: row! } as const
    } catch(error) {
        return { ok: false, errorCode: 'conflict' } as const
    }
}


export async function login(credentials: {username: string, pwd : string}) {
    const {username, pwd: password} = credentials

    try {
        const [row] = await db.select().from(users).where(eq(users.username, username))
        if(!row) {
            return {ok:false, errorCode: 'not found'} as const
        }
        const valid = await Bun.password.verify(password, row.pwd, "bcrypt")
        if(!valid){
            return {ok: false, errorCode: 'invalid password'} as const
        }
        return {ok: true, data: row!} as const
    }catch(error) {
        return { ok: false, errorCode: 'conflict' } as const
    }
}

export async function deleteUser(uuid: string) {
    const [row] = await db.delete(users).where(eq(users.uuid, uuid)).returning()
    if (!row) {
        return error(401, "Could not delete user")
    }
    
    return row
}

export async function getUser(uuid: string) {
    const [row] = await db.select().from(users).where(eq(users.uuid, uuid))
    if (!row) {
        return error(404, "User not found")
    }
    return row
}

export async function verifyUser(
    credentials: { 
        uuid: string, 
        username: string,
        password : string 
    }) {
    const {uuid,username, password } = credentials
    if (!uuid || !username || !password) {
        return error(422, "All fields are required")
    }
    const [row] = await db.select().from(users).where(eq(users.uuid, uuid))
    if (!row) {
        return error(404, "User not found")
    }
    const valid = await Bun.password.verify(password, row.pwd, "bcrypt")
    return valid ? row : error(401, "Invalid credentials")
}

export async function updateUser(
    newCredentials: {
      uuid: string,
      username: string,
      email: string,
      password: string
    }
) {
    const {uuid, username, email, password } = newCredentials

    const [user] = await db.select().from(users).where(eq(users.uuid, uuid))
    if (!user) {
        return error(404, "User not found")
    }

    Bun.password.verify(password, user.pwd, "bcrypt").then((valid) => {
        if (valid) {
            return error(409, "Already using this password")
        }
    })

    const hashedPwd = await Bun.password.hash(password, {
        algorithm: "bcrypt",
    });
    const [row] = await db.update(users).set(
        {
            username: username,
            email: email,
            pwd: hashedPwd
        }
    )
    .where(eq(users.uuid, uuid))
    .returning()

    if (!row) {
        return error(409, "Could not update user credentials")
    }

    return row
}