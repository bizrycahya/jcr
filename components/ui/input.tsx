"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-maroon-200 bg-white px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-maroon-500 focus:ring-2 focus:ring-maroon-500/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";