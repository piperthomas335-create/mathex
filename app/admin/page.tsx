import { AdminLogin, AdminWorkspace } from "@/components/admin-workspace"
import { WorkspaceShell } from "@/components/workspace-shell"
import { isAdmin } from "@/lib/admin-auth"

export default async function AdminPage() {
  const authorized = await isAdmin()
  return <WorkspaceShell>{authorized ? <AdminWorkspace /> : <AdminLogin />}</WorkspaceShell>
}
