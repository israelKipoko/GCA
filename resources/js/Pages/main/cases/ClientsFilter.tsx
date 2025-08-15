import * as React from "react"
import { Column } from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "../../../../../lib/utils"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"
import { useTranslation } from "react-i18next";
import { ScrollArea } from "../../../../../components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover"
import { Separator } from "../../../../../components/ui/separator"

interface ClientsFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  name?: string
  options: {
    name: string
// span: any
// icon?: React.ComponentType<{ className?: string }>
 }[]
}

export function ClientsFilter<TData, TValue>({
  column,
  name,
options,
}: ClientsFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

     const { t, i18n } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8  dark:bg-[#d8d8d844] bg-[#29292922] hover:dark:bg-[#d8d8d833] hover:bg-[#29292933] flex gap-x-1">
          <PlusCircle size={14}/> {name}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className={`rounded-sm px-1 font-normal lg:hidden`}
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {t("selected")}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.name))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.name}
                        className={`rounded-md px-1 font-normal `}
                      >
                        {option.name ? t(option.name) : 'priorité'}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder='Clients' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea className="flex items-center w-full max-h-[150px]">
                <CommandGroup className="">
                    {options.map((option) => {
                        const isSelected = selectedValues.has(option.name)
                        return (
                        <CommandItem
                            key={option.name}
                            onSelect={() => {
                            if (isSelected) {
                                selectedValues.delete(option.name)
                            } else {
                                selectedValues.add(option.name)
                            }
                            const filterValues = Array.from(selectedValues)
                            column?.setFilterValue(
                                filterValues.length ? filterValues : undefined
                            )
                            }}
                            className="dark:hover:bg-dark-hover hover:bg-light-hover cursor-pointer "
                        >
                            <div
                            className={cn(
                                "flex size-4 items-center justify-center rounded-[4px] border",
                                isSelected
                                ? "bg-[#d8d8d844] border-primary text-primary-foreground"
                                : "border-input [&_svg]:invisible"
                            )}
                            >
                            <Check className="text-primary-foreground size-3.5" />
                            </div>
                            {/* {option.span && (
                                option.span
                            )} */}
                            <span> {option.name}</span>
                            {facets?.get(option.name) && (
                            <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                {facets.get(option.name)}
                            </span>
                            )}
                        </CommandItem>
                        )
                    })}
                </CommandGroup>
            </ScrollArea>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center dark:hover:bg-dark-hover hover:bg-light-hover cursor-pointer"
                  >
                  {t("Clear filters")}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}