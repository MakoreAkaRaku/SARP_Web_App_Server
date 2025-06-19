import { userPermissions } from "../database/schema"
import { Html } from "@elysiajs/html"
import { IconDefaultUser } from "../pages/resources/resources"

export function UserProfile(user: { username:string, userRole: number }) {
  return (
    <a href="/profile" class="flex flex-row gap-x-4 items-center border-green-700 rounded-md hover:bg-gray-600 hover:border-green-500 shadow-md px-2 border-x-2">
      <IconDefaultUser classes="size-10" />
      <div class="flex text-center flex-col">
        <span>{user.username}</span>
        <span class="text-gray-500">{userPermissions.at(user.userRole-1)}</span>
      </div>
    </a>
  )
}