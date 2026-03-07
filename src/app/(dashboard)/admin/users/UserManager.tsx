"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, Shield, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { createUser, updateUser, deleteUser } from "@/lib/user-actions";
import Pagination from "@/components/layout/Pagination";

interface UserItem {
  id: number;
  username: string;
  email: string | null;
  role: string | null;
  lastLogin: Date | null;
  createdAt: Date | null;
}

const PAGE_SIZE = 15;

export default function UserManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createUser(formData);
      if (result.success) {
        (document.getElementById("add_user_modal") as HTMLDialogElement).close();
        showToast("User created", "success");
        router.refresh();
      } else {
        showToast(result.error || "Failed to create", "error");
      }
    } catch { showToast("Error creating user", "error"); }
    finally { setIsLoading(false); }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUser) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateUser(editUser.id, formData);
      if (result.success) {
        (document.getElementById("edit_user_modal") as HTMLDialogElement).close();
        showToast("User updated", "success");
        setEditUser(null);
        router.refresh();
      } else {
        showToast(result.error || "Failed to update", "error");
      }
    } catch { showToast("Error updating user", "error"); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    const result = await deleteUser(id);
    if (result.success) {
      setUsers(users.filter((u) => u.id !== id));
      showToast("User deleted", "success");
    } else {
      showToast(result.error || "Failed to delete", "error");
    }
  };

  const roleConfig: Record<string, { cls: string }> = {
    admin: { cls: "bg-primary/10 text-primary" },
    user: { cls: "bg-base-200/60 text-base-content/60" },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-fade-in relative">
      {toast && (
        <div className="toast toast-top toast-center z-[100]">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg rounded-xl border-0 flex gap-2 text-sm font-medium animate-scale-in`}>
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-base-content/50 text-sm mt-0.5">Manage team access and roles</p>
        </div>
        <button className="btn btn-primary btn-sm gap-1.5 rounded-lg shadow-sm text-xs font-semibold h-9 px-4" onClick={() => (document.getElementById("add_user_modal") as HTMLDialogElement)?.showModal()}>
          <Plus size={15} strokeWidth={2.5} /> Add User
        </button>
      </div>

      <div className="card bg-base-100 border border-base-300/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr className="border-b border-base-300/40">
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">User</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Role</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Last Login</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3">Created</th>
              <th className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40 px-5 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/40 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        {user.role === "admin" ? <Shield size={14} /> : <UserIcon size={14} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.username}</div>
                        <div className="text-[10px] text-base-content/40">{user.email || "No email"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${roleConfig[user.role || "user"]?.cls || roleConfig.user.cls}`}>{user.role || "user"}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-base-content/50">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</td>
                  <td className="px-5 py-3 text-xs text-base-content/50">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-primary hover:bg-primary/8" onClick={() => { setEditUser(user); (document.getElementById("edit_user_modal") as HTMLDialogElement)?.showModal(); }}><Edit3 size={13} /></button>
                      <button className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error hover:bg-error/8" onClick={() => handleDelete(user.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={users.length} />
      </div>

      {/* Add User Modal */}
      <dialog id="add_user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-md rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">New User</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Username</label><input name="username" type="text" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Email</label><input name="email" type="email" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Password</label><input name="password" type="password" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" required minLength={6} /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Role</label>
              <select name="role" className="select select-bordered select-sm w-full bg-base-200/30 rounded-lg h-9 text-sm"><option value="user">User</option><option value="admin">Admin</option></select>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button type="button" className="btn btn-ghost btn-sm rounded-lg" onClick={() => (document.getElementById("add_user_modal") as HTMLDialogElement).close()}>Cancel</button>
              <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm rounded-lg shadow-sm">{isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Create User"}</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Edit User Modal */}
      <dialog id="edit_user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box sm:w-11/12 sm:max-w-md rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-5">Edit User</h3>
          {editUser && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2"><span className="text-xs font-mono bg-base-200/50 px-2 py-0.5 rounded text-base-content/50">{editUser.username}</span></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Email</label><input name="email" type="email" defaultValue={editUser.email || ""} className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">New Password</label><input name="password" type="password" placeholder="Leave blank to keep current" className="input input-bordered input-sm w-full bg-base-200/30 rounded-lg h-9 text-sm" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1 block">Role</label>
                <select name="role" defaultValue={editUser.role || "user"} className="select select-bordered select-sm w-full bg-base-200/30 rounded-lg h-9 text-sm"><option value="user">User</option><option value="admin">Admin</option></select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" className="btn btn-ghost btn-sm rounded-lg" onClick={() => { (document.getElementById("edit_user_modal") as HTMLDialogElement).close(); setEditUser(null); }}>Cancel</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm rounded-lg shadow-sm">{isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Save Changes"}</button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  );
}
