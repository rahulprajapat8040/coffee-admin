import { Info } from "lucide-react";

interface ErrorMessageProp {
  message?: string;
}
export const ErrorMessage: React.FC<ErrorMessageProp> = ({ message }) => {
  return (
    message && (
      <div className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
        <Info size={13} />
        <span className="inline-block m-0! p-0">{message}</span>
      </div>
    )
  );
};
