import React from 'react';
import { cn } from '../../utils';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative h-3 w-full overflow-hidden rounded-full bg-secondary/20', className)}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-secondary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
