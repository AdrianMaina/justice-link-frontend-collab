import React from 'react';
import { cn } from '../../utils';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary text-primary-foreground" : "bg-transparent",
      className
    )}
    {...props}
  >
    <Check className={cn("h-4 w-4", checked ? "opacity-100" : "opacity-0")} />
  </button>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
