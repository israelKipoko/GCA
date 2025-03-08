import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { Button } from "../..components/ui/button"
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover"

const DatePicker = () =>{
  const [date, setDate] = React.useState();
  const handleInputChange = (event) => {
    setDate(event.target.value);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={
            "w-[280px] justify-start text-left font-normal"
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
       <div className="" >
          <input type="text" wire:model="date" value={date} className=" "/>
        </div>
      <PopoverContent className="w-auto p-0 bg-[#fff] text-[#22243D]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker

