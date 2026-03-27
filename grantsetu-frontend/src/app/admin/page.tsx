import { API_URL } from "@/lib/constants";

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return null;
  }
}

async function getScraperHealth() {
  try {
    const res = await fetch(`${API_URL}/api/v1/admin/scrapers/health`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [stats, scraperRuns] = await Promise.all([getStats(), getScraperHealth()]);

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-[#05073F] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>Admin Dashboard</h1>
        <p className="text-sm text-brand-500 mt-1">Overview of grants, users, and scraper health</p>
      </div>

      {/* Stats — pastel colored cards like Topmate feature section */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Grants", value: stats.grants_total, bg: "bg-blue-50 border-blue-100", color: "text-blue-700" },
            { label: "Active Grants", value: stats.grants_active, bg: "bg-teal-50 border-teal-100", color: "text-teal-700" },
            { label: "Total Users", value: stats.users_total, bg: "bg-purple-50 border-purple-100", color: "text-purple-700" },
            { label: "Alert Subscribers", value: stats.alerts_enabled, bg: "bg-accent-50 border-accent-100", color: "text-accent-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border rounded-xl p-5`}>
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Scraper Health */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#05073F] tracking-heading mb-4" style={{ fontFamily: "var(--font-display)" }}>Recent Scraper Runs</h2>
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Agency</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Started</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Found</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>New</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-brand-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {(scraperRuns as Array<Record<string, unknown>>).length > 0 ? (
                  (scraperRuns as Array<Record<string, unknown>>).map((run: Record<string, unknown>) => (
                    <tr key={run.id as number} className="hover:bg-brand-50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-brand-900">{run.agency as string}</td>
                      <td className="px-5 py-3.5 text-brand-500">
                        {run.started_at ? new Date(run.started_at as string).toLocaleString("en-IN") : "-"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                            run.status === "success"
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : run.status === "failed"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {run.status as string}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-brand-600">{run.grants_found as number}</td>
                      <td className="px-5 py-3.5 text-brand-600">{run.grants_new as number}</td>
                      <td className="px-5 py-3.5 text-red-500 text-xs max-w-[200px] truncate">
                        {(run.error_message as string) || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-brand-400">
                      No scraper runs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <a href="/admin/grants/new" className="btn-primary">
          Add Grant Manually
        </a>
      </div>
    </div>
  );
}
