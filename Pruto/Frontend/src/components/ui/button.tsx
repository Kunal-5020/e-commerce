// components/ui/button.tsx
import { cn } from "../../lib/utils";

export function Button({ className = '', variant = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }) {
  const base = 'px-4 py-2 font-semibold rounded-md focus:outline-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  return (
    <button
      {...props}
      className={cn(base, variants[variant], className)}
    />
  );
}