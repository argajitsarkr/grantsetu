export default function GrantDetailLoading() {
  return (
    <div className="container-main py-8">
      <div className="max-w-4xl">
        <div className="h-4 w-32 bg-brand-100 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-14 bg-brand-100 rounded-lg animate-pulse" />
          <div className="h-5 w-24 bg-brand-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-3/4 bg-brand-100 rounded-xl animate-pulse" />
        <div className="h-5 w-full bg-brand-50 rounded-lg animate-pulse mt-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl p-5 bg-brand-50">
              <div className="h-3 w-16 bg-brand-100 rounded animate-pulse" />
              <div className="h-7 w-28 bg-brand-100 rounded-lg animate-pulse mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
