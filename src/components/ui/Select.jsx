// File: src/components/ui/Select.jsx
import React from 'react';
const cnSelect = (...classes) => classes.filter(Boolean).join(' ');
export const Select = ({ className, children, ...props }) => (
    <select className={cnSelect("flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>
        {children}
    </select>
);