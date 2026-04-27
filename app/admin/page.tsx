import { AdminPanelClient } from "@/components/admin-panel-client"
import { loginAdmin } from "@/app/admin/actions"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const preferredRegion = "fra1"

type AdminTab = "products" | "availability" | "orders" | "users"

function getTab(searchParams: { tab?: string } | undefined): AdminTab {
  if (
    searchParams?.tab === "availability" ||
    searchParams?.tab === "orders" ||
    searchParams?.tab === "users"
  ) {
    return searchParams.tab
  }

  return "products"
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; productId?: string; date?: string; q?: string; authError?: string }>
}) {
  const params = await searchParams
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold tracking-tight">Admin login</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter password to access the admin panel.
          </p>

          <form action={loginAdmin} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500"
              />
            </label>

            {params?.authError === "1" && (
              <p className="text-sm text-red-600 dark:text-red-400">Invalid password.</p>
            )}

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-slate-950 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Sign in
            </button>
          </form>
        </section>
      </main>
    )
  }

  const activeTab = getTab(params)
  return (
    <AdminPanelClient
      initialTab={activeTab}
      initialProductId={params?.productId}
      initialDate={params?.date}
      initialQuery={params?.q}
    />
  )
}
