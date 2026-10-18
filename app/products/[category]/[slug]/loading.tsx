export default function Loading() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 animate-pulse">
          <div className="aspect-square rounded-2xl bg-background-secondary" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-background-secondary" />
            <div className="h-10 w-3/4 rounded bg-background-secondary" />
            <div className="h-20 w-full rounded bg-background-secondary" />
            <div className="h-12 w-40 rounded bg-background-secondary" />
          </div>
        </div>
      </div>
    </main>
  );
}