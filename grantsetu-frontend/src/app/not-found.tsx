import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-accent-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-900 tracking-heading">Page not found</h1>
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
