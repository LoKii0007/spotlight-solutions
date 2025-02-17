"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Message {
  from: string;
  subject: string;
  body: string;
  date: string;
  id: string;
}

const Gmail = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchGmail() {
    try {
      setLoading(true);
      const res = await axios.get("/api/gmail", {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      });
      if (res.status === 200) {
        setMessages(res.data);
      } else {

        console.log("error", res.data);
        toast.error(res.data.error);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Server Error. please try again later!");
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchGmail();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 px-8 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-3/12">From</div>
            <div className="w-8/12">body</div>
            <div className="w-1/12">Date</div>
          </div>
          {loading ? <div>Loading...</div> : messages.length > 0 ? messages.map((message: any) => (
            <div key={message.id} className="flex gap-4">
              <div className="w-3/12 text-ellipsis text-nowrap overflow-hidden">{message.from}</div>
              <div className="w-8/12 text-ellipsis text-nowrap overflow-hidden"> <span className="font-semibold">{message.subject}</span> {message.body}</div>
              <div className="w-1/12 text-ellipsis text-nowrap overflow-hidden">{message.date}</div>
            </div>
          )) : <div>No mails found</div>}
        </div>
      </div>
    </>
  );
};

export default Gmail;
