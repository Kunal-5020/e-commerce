
// components/ui/card.tsx
import { cn } from "../lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, className }: { title: string; className?: string }) {
  return (
    <h2
      className={cn(
        'text-2xl font-semibold text-center mb-4',
        className
      )}
    >
      {title}
    </h2>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'space-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}
