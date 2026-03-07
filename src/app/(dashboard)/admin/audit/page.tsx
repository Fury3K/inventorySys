import { getAuditLogs } from "@/lib/user-actions";
import AuditLog from "./AuditLog";

export default async function AuditPage() {
  const data = await getAuditLogs(1, 30);
  return <AuditLog initialData={data} />;
}
