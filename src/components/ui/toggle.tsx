interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export const Toggle = ({ value, onChange }: Props) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-hover"}`}
      aria-label="Toggle availability"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-card transition-all ${value ? "left-6" : "left-1"}`}
      />
    </button>
  );
};
