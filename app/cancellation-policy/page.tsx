import Link from "next/link"

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cancellation Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          This page is ready. You can add your final Cancellation Policy content here at any time.
        </p>
        <Link href="/" className="mt-8 inline-flex text-sm font-medium text-[#1a365d] hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
