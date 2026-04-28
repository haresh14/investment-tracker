export default function InvestmentDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-8">
      <div className="h-24 rounded-3xl bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-[460px] rounded-3xl bg-slate-200" />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="h-80 rounded-3xl bg-slate-200" />
        <div className="h-80 rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}
