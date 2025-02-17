"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormData = {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  status: string;
  project: string;
  location: string;
  description: string;
};

const Appointment = ({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    toast.success("Appointment created successfully");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Add Appointment</h1>
      <hr className="border-t-2 border-green-500 mb-6" />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <span className="text-red-500">{errors.title.message}</span>}
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start</label>
            <div className="flex space-x-2">
              <input
                type="text"
                {...register('startDate', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1/2/25"
              />
              <input
                type="text"
                {...register('startTime', { required: 'Start time is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12:00 AM"
              />
            </div>
            {errors.startDate && <span className="text-red-500">{errors.startDate.message}</span>}
            {errors.startTime && <span className="text-red-500">{errors.startTime.message}</span>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End</label>
            <div className="flex space-x-2">
              <input
                type="text"
                {...register('endDate', { required: 'End date is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1/2/25"
              />
              <input
                type="text"
                {...register('endTime', { required: 'End time is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12:00 AM"
              />
            </div>
            {errors.endDate && <span className="text-red-500">{errors.endDate.message}</span>}
            {errors.endTime && <span className="text-red-500">{errors.endTime.message}</span>}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" {...register('allDay')} className="mr-2" />
            All Day
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Show me as</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" value="Available" {...register('status', { required: 'Status is required' })} className="mr-2" />
              Available
            </label>
            <label className="flex items-center">
              <input type="radio" value="Busy" {...register('status', { required: 'Status is required' })} className="mr-2" />
              Busy
            </label>
          </div>
          {errors.status && <span className="text-red-500">{errors.status.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Project</label>
          <select
            {...register('project', { required: 'Project is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Project</option>
            <option value="Project A">Project A</option>
            <option value="Project B">Project B</option>
          </select>
          {errors.project && <span className="text-red-500">{errors.project.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <textarea
            {...register('location')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default Appointment;
