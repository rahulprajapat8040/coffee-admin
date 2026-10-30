export const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) => {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-4xl font-semibold text-ink">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
};
