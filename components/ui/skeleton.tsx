import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md dark:bg-dark-hover bg-light-hover border-none", className)} {...props}></div>
  )
}

export { Skeleton }
