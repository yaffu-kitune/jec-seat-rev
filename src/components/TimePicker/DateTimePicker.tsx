import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { ja } from "date-fns/locale";

export default function DateTimePicker() {
  const [date, setDate] = useState<Date | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false); // New state for popover visibility

  useEffect(() => {
    setDate(new Date());
  }, []);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleAccept = () => {
    setDate(date); // 選択された日付を保持
    setPopoverOpen(false); // ポップオーバーを閉じる
  };

  const handleCancel = () => {
    // 何もしないか、条件に基づいて日付をリセット
    setPopoverOpen(false); // ポップオーバーを閉じる
  };

  const handleOpen = () => {
    setPopoverOpen(true); // Function to open popover
  };

  return (
    <Popover open={popoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={handleOpen} // Open popover on button click
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm:ss", { locale: ja })
          ) : (
            <span>Loading date...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-10">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <StaticDateTimePicker
              orientation="landscape"
              displayStaticWrapperAs="mobile"
              openTo="day"
              disablePast={true}
              value={date ?? new Date()}
              onChange={handleDateChange}
              onAccept={handleAccept}
              onClose={handleCancel}
            />
          </LocalizationProvider>
        </div>
      </PopoverContent>
    </Popover>
  );
}
