import { Eye, EyeOff } from "lucide-react";
import { ReactNode } from "react";

interface VisibilityFieldProps {
  label: string;
  visible: boolean;
  onToggle: (visible: boolean) => void;
  children: ReactNode;
  hint?: string;
}

export function VisibilityField({
  label,
  visible,
  onToggle,
  children,
  hint,
}: VisibilityFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => onToggle(!visible)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            visible
              ? "bg-[#d4a853]/10 text-[#d4a853] hover:bg-[#d4a853]/20"
              : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
          }`}
          title={visible ? "Visible on website" : "Hidden on website"}
        >
          {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>{visible ? "ON" : "OFF"}</span>
        </button>
      </div>
      {children}
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
    </div>
  );
}
