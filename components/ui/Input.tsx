// File: components\ui\Input.tsx

import { cn } from "@/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  placeholderText?: string;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon, placeholderText, iconPosition = "left", ...props },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex gap-1">
            <span>{icon}</span>
            <span>{placeholderText}</span>
          </div>
        )}
        <input
          type={type}
          className={cn(
            `flex h-9 w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`,
            icon
              ? iconPosition === "left"
                ? "pl-9 pr-3"
                : "pl-3 pr-9"
              : "px-3",
            "text-right",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex gap-3">
            <span>{icon}</span>
            <span>{placeholderText}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
