import { error, t } from "elysia"
import { users, userPermissions } from "../database/schema"
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
        return {valid: false, body: "User does not exist anymore"} as const 
    }
    
    return {valid: true, body: row} as const
}

export async function getUser(uuid: string) {
    const [row] = await db.select().from(users).where(eq(users.uuid, uuid))
    if (!row) {
        return {valid: false, body: "User not found"} as const
    }

    return {valid: true, body:row} as const
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

    //TODO: recheck if this is correct, at least for verification side.
    // const [user] = await db.select().from(users).where(eq(users.uuid, uuid))
    // if (!user) {
    //     return {valid: false, body: "User Not Found"} as const 
    // }
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
        return{valid: false, body: "Couldn't update credentials"} as const
    }

    return {valid: true, body: row} as const
}

export function hasAdminRole(user: {uuid: string, username: string, userRole: number} ) : Boolean {
  return user.userRole == userPermissions.indexOf("admin")+1
}

export async function checkRole(user: {uuid: string,userRole: number}) {
  
  const [row] = await db.select({role_id: users.permit_id}).from(users).where(eq(users.uuid,user.uuid))
  
  if(!row){
    return {valid: false, body: "Non existent user"}
  }

  return {valid: true, body: row.role_id == user.userRole}
}

export async function getUserRole(uuid: string) {
  
  const [result] = await db.select({role: users.permit_id}).from(users).where(eq(users.uuid,uuid))
  
  if(!result) {
    return {valid: false, body: "Non existent user" } as const 
  }

  return {valid: true, body: result?.role} as const
}

export async function updateUserRole(requester: {uuid: string}, user: { uuid: string, userRole: number}) {
  
  if(user.userRole <= 0 || user.userRole > userPermissions.length) {
    return {valid: false, body: "non existant role"} as const
  }
  
  const [row] = await db.update(users).set({permit_id: user.userRole}).where(eq(users.uuid,user.uuid)).returning()
  if(!row) {
    return {valid: false, body: "User does not exist"} as const
  }

  return {valid: true, body: row} as const
}