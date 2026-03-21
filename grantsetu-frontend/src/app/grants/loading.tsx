export default function GrantsLoading() {
  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <div className="h-9 w-56 bg-brand-100 rounded-xl animate-pulse" />
        <div className="h-4 w-36 bg-brand-100 rounded-lg animate-pulse mt-2" />
      </div>
      <div className="h-12 bg-brand-50 rounded-xl animate-pulse mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-14 bg-brand-100 rounded-lg animate-pulse" />
              <div className="h-5 w-28 bg-brand-100 rounded-lg animate-pulse" />
            </div>
            <div className="h-6 w-3/4 bg-brand-100 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-brand-50 rounded-lg animate-pulse mt-2" />
            <div className="flex gap-3 mt-4">
              <div className="h-4 w-24 bg-brand-100 rounded-lg animate-pulse" />
              <div className="h-4 w-16 bg-brand-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
