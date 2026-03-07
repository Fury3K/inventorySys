import { getUsers } from "@/lib/user-actions";
import UserManager from "./UserManager";

export default async function UsersPage() {
  const users = await getUsers();
  return <UserManager initialUsers={users} />;
}
