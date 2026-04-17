import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-[#E9283D]" style={{ fontFamily: "var(--font-display)" }}>404</p>
        <h1 className="mt-4 text-2xl font-bold text-[#0A0A0A] tracking-heading" style={{ fontFamily: "var(--font-display)" }}>Page not found</h1>
        <p className="mt-2 text-brand-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link
          href="/grants"
          className="mt-8 btn-primary"
        >
          Browse Grants
        </Link>
      </div>
    </div>
  );
}
