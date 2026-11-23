import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface SelectOption {
  label: string;
  value: string | null;
  disabled?: boolean;
}

interface AppSelectProps {
  options: SelectOption[];

  value?: string;

  defaultValue?: string;

  placeholder?: string;

  onValueChange?: (value: string) => void;

  disabled?: boolean;

  className?: string;

  ariaLabel?: string;
}

export const AppSelect = ({
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  onValueChange,
  disabled,
  className,
  ariaLabel,
}: AppSelectProps) => {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="w-full">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value|| ''}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
