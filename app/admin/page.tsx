import { AdminPanelClient } from "@/components/admin-panel-client"

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
  searchParams?: Promise<{ tab?: string; productId?: string; date?: string; q?: string }>
}) {
  const params = await searchParams
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
