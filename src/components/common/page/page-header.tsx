export const PageHeader = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => {
  return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
      </div>
  );
};
