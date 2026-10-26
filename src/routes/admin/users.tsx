import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { adminCreateUserFn, adminListUsersFn, adminUpdateUserFn } from "@/api/users";
import { pageHead } from "@/lib/site";
import type { PublicUser } from "@/lib/auth-types";

export const Route = createFileRoute("/admin/users")({
  head: () => pageHead({ title: "Users | Admin", description: "Manage Rohit Samaj users.", path: "/admin/users" }),
  loader: () => adminListUsersFn({ data: {} }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const initial = Route.useLoaderData();
  const [users, setUsers] = useState<PublicUser[]>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    setUsers(await adminListUsersFn({ data: {} }));
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const result = await adminCreateUserFn({ data: { name, email, password, role } });
    if (!result.ok) {
      setError(result.error === "EMAIL_IN_USE" ? "Email already in use." : "Could not create user.");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setMessage("User created.");
    await refresh();
  }

  async function setUserRole(id: string, nextRole: "admin" | "user") {
    const result = await adminUpdateUserFn({ data: { id, role: nextRole } });
    if (!result.ok) setError(result.error === "LAST_ADMIN" ? "Cannot demote the last admin." : "Update failed.");
    else {
      setError("");
      await refresh();
    }
  }

  async function setUserStatus(id: string, status: "active" | "disabled") {
    const result = await adminUpdateUserFn({ data: { id, status } });
    if (!result.ok) setError(result.error === "LAST_ADMIN" ? "Cannot disable the last admin." : "Update failed.");
    else {
      setError("");
      await refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-muted-foreground">Create accounts and manage roles.</p>
      </div>

      <form onSubmit={onCreate} className="grid gap-3 rounded-lg border border-border bg-background p-5 md:grid-cols-5">
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
          Create
        </button>
      </form>
      {error ? <p className="text-sm text-brand">{error}</p> : null}
      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setUserRole(user.id, user.role === "admin" ? "user" : "admin")}>
                      Make {user.role === "admin" ? "user" : "admin"}
                    </button>
                    <button type="button" className="rounded border border-border px-2 py-1" onClick={() => setUserStatus(user.id, user.status === "active" ? "disabled" : "active")}>
                      {user.status === "active" ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
