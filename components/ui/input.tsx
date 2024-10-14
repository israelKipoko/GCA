import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="input_div">
      <input
            type={type}
            className={cn(
              "flex pl-[25px] h-10 w-full rounded-md text-[#fff] border-input bg-[#313131] pr-3  py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}/>
            <i className="fa-solid fa-magnifying-glass opacity-[0.7] text-[#fff] absolute left-2 top-3 text-muted-foreground"></i>
      </div>
     
    )
  }
)
Input.displayName = "Input"

export { Input }
