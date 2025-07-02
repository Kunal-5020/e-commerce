// components/ui/label.tsx
import { cn } from "../../lib/utils";

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block mb-1 text-sm font-medium text-gray-700',
        className
      )}
    >
      {children}
    </label>
  );
}
