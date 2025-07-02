// components/ui/input.tsx
import { cn } from "../../lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.className
      )}
    />
  );
}