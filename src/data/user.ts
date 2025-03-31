import { error } from "elysia"
import { users } from "../database/schema"
import { db } from "../db"
import { eq } from "drizzle-orm"


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


export async function login(credentials: {username: string, password : string}) {
    const {username, password} = credentials

    try {
        const [row] = await db.select().from(users).where(eq(users.username, username))
        if(!row) {
            return {ok:false, errorCode: 'not found'} as const
        }
        const valid = await Bun.password.verify(password, row.pwd, "bcrypt")
        if(!valid){
            return {ok: false, errorCode: 'invalid pwd'} as const
        }
        return {ok: true, data: row!} as const
    }catch(error) {
        return { ok: false, errorCode: 'conflict' } as const
    }
}

export async function deleteUser(uuid: string) {
    if (!uuid) {
        return error(422, "UUID is required")
    }
    const [row] = await db.delete(users).where(eq(users.uuid, uuid)).returning()
    if (!row) {
        return error(401, "Could not delete user")
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
    uuid: string,
    newCredentials: {
        username: string,
        email: string,
        password: string
    }
) {
    const { username, email, password } = newCredentials
    if (!uuid) {
        return error(422, "UUID is required")
    }

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
        return error(401, "Could not update user")
    }

    return row
}