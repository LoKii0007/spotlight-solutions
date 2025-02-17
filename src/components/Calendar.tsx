"use client";

import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal";
import axios from "axios";

const localizer = momentLocalizer(moment);

export interface EventType {
  start: Date;
  end: Date;
  title: string;
}

const MyCalendar = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [open, setOpen] = useState(false);

  const loginWithGoogle = async () => {
    const res = await fetch("/api/generateAuthUrl");
    const { authUrl } = await res.json();
    window.location.href = authUrl;
  };


  const fetchEvents = async () => {

    try {
      const res = await axios.get("/api/calendar");
      const data = res.data;
      console.log('data', data);

      const formattedEvents = data.map((event: any) => ({
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
      }));

      console.log('formattedEvents', formattedEvents);
      const test = {
        start: new Date(),
        end: new Date(),
        title: 'testing',
      }
      setEvents([test]);


    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ height: "100vh", padding: 20 }}>
      <button className="bg-black text-white px-4 py-2 rounded-md" onClick={loginWithGoogle} style={{ marginBottom: 20, padding: 10 }}>
        Sync Google apps
      </button>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80%", backgroundColor: "#DDDDDD", color: "black" }}
      />
      <Modal open={open} setOpen={setOpen} />
    </div>
  );
};

export default MyCalendar;
