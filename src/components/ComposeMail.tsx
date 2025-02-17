"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

type FormData = {
  to: string;
  subject: string;
  body: string;
};

const ComposeMail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/sendMail", {
        subject: data.subject,
        message: data.body,
        email: data.to,
      });
      
      if (response.status === 200) {
        toast.success("Email sent successfully");
        reset();
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Error sending email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMail = () => {
    if (isOpen) {
      // Check required fields before attempting to send
      if (!getValues().to) {
        toast.error("Please enter recipient email");
        return;
      }
      if (!getValues().subject) {
        toast.error("Please enter subject");
        return;
      }
      if (!getValues().body) {
        toast.error("Please enter message");
        return;
      }
      handleSubmit(onSubmit)();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      <Button
        onClick={() => handleMail()}
        type="button"
        className={`bg-blue-500 absolute text-white px-4 w-[91.13px] py-2 rounded-full ease-in-out transition-all duration-500 shadow-lg ${
          isOpen ? "right-6 bottom-6" : "right-0 bottom-0"
        }`}

      >
        {isLoading ? "Sending..." : isOpen ? "Send" : "Compose"}
      </Button>

      <div
        className={`max-w-2xl p-6 bg-white overflow-hidden flex flex-col justify-between transition-all duration-500 ease-in-out origin-bottom-right shadow-lg rounded-[18px] w-96 ${
          isOpen ? "h-[420px] w-[30vw]" : "h-[36px] w-[91.13px]"
        }`}
      >

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">New Message</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600">
            ✕
          </button>
        </div>
        <form className="mb-8">
          <input
            type="email"
            {...register("to", { 
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            placeholder="To"
            className={`w-full p-2 border rounded mb-3 ${errors.to ? 'border-red-500' : ''}`}
          />
          <input
            type="text"
            {...register("subject", { required: true })}
            placeholder="Subject"
            className={`w-full p-2 border rounded mb-3 ${errors.subject ? 'border-red-500' : ''}`}
          />
          <textarea
            {...register("body", { required: true })}
            placeholder="Compose your email..."
            className={`w-full p-2 border rounded mb-3 h-40 ${errors.body ? 'border-red-500' : ''}`}
          />
        </form>
      </div>
    </div>
  );
};

export default ComposeMail;
