"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimerReset } from "lucide-react";

const TimeZones = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<string>("EST");
  const [convertedTime, setConvertedTime] = useState<Date>(new Date());
  const [currentIST, setCurrentIST] = useState<Date>(new Date());
  const [selectedHours, setSelectedHours] = useState<string>("12");
  const [selectedMinutes, setSelectedMinutes] = useState<string>("00");
  const [isPM, setIsPM] = useState<boolean>(true);

  const timeZones = useMemo(
    () => [
      { name: "EST", offset: -5 },
      { name: "CST", offset: -6 },
      { name: "PST", offset: -8 },
      { name: "MT", offset: -7 },
      { name: "CAN", offset: -5 },
      { name: "UK", offset: 0 },
      { name: "SGP", offset: 8 },
      { name: "AWST", offset: 8 },
      { name: "AEST", offset: 10 },
    ],
    []
  );

  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    []
  );

  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIST(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const convertTime = () => {
      const istNow = new Date();
      istNow.setHours(
        parseInt(selectedHours) + (isPM && selectedHours !== "12" ? 12 : 0),
        parseInt(selectedMinutes)
      );

      const selectedTz = timeZones.find((tz) => tz.name === selectedTimezone);
      if (!selectedTz) return;

      // Convert IST to UTC, then apply the offset
      const utcTime = new Date(istNow.getTime() - 5.5 * 60 * 60 * 1000);
      const converted = new Date(utcTime.getTime() + selectedTz.offset * 60 * 60 * 1000);
      setConvertedTime(converted);
    };

    convertTime();
  }, [selectedTimezone, selectedHours, selectedMinutes, isPM]);

  const resetToActualTime = () => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = istTime.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = istTime.getMinutes().toString().padStart(2, "0");
    const pm = istTime.getHours() >= 12;

    setSelectedHours(hours.toString());
    setSelectedMinutes(minutes);
    setIsPM(pm);
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="opacity-70">IST :</span>
        {currentIST.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
      </div>

      <button onClick={resetToActualTime} className="mx-4 p-1 bg-blue-500 text-white rounded">
        <TimerReset />
      </button>

      <Select value={selectedHours} onValueChange={setSelectedHours}>
        <SelectTrigger className="w-[60px]">
          <SelectValue placeholder="12" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMinutes} onValueChange={setSelectedMinutes}>
        <SelectTrigger className="w-[60px]">
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={isPM ? "PM" : "AM"} onValueChange={(val) => setIsPM(val === "PM")}>
        <SelectTrigger className="w-[60px]">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select Timezone" />
        </SelectTrigger>
        <SelectContent>
          {timeZones.map((tz) => (
            <SelectItem key={tz.name} value={tz.name}>
              {tz.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-gray-600">
        {convertedTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
      </div>
    </div>
  );
};

export default TimeZones;
