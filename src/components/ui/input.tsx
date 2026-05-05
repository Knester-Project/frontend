import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:inline-flex disabled:opacity-50 shadow-xs px-3 py-2 border border-input file:border-0 rounded-md outline-none w-full min-w-0 h-9 file:h-7 file:font-medium transition-[color,box-shadow] disabled:cursor-not-allowed disabled:pointer-events-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "placeholder:text-[11px] md:placeholder:text-xs xl:placeholder:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
