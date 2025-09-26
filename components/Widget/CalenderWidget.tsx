"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);
  
  // Get the first day of the week of the first day of the month
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // Start week on Monday
  // Get the last day of the week of the last day of the month
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className='bg-transparent pt-2'>
        <div className="w-[176px] h-[176px] bg-white/90 dark:bg-black/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg flex flex-col py-3 cursor-grab active:cursor-grabbing text-white">
      {/* Header: Month Name */}
      <p className="text-red-500 font-semibold text-[12px] tracking-wide px-4">
        {format(today, 'MMMM').toUpperCase()}
      </p>

      {/* Weekday Letters */}
      <div className="grid grid-cols-7 text-center text-xs text-neutral-600 dark:text-neutral-300  font-medium mt-1 ml-0 px-3">
        {weekdays.map(day => <span key={day}>{day}</span>)}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-xs mt-1 px-3">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "p-1 flex items-center justify-center h-[22px] dark:text-white text-black",
              !isSameMonth(day, today) && "dark:text-neutral-600 text-neutral-400", // Muted color for outside days
              isSameDay(day, selectedDate) && "bg-red-500 rounded-full font-bold text-white", // Red circle for selected
              isSameDay(day, today) && !isSameDay(day, selectedDate) && "dark:text-white text-black font-bold" // Bold today's date
            )}
            onClick={() => setSelectedDate(day)}
          >
            <span>{format(day, 'd')}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

CalendarWidget.displayName = "CalendarWidget";