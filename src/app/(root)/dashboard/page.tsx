import React from "react";
import TaskList from "@/components/TaskList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Inbox from "@/components/Inbox";
import Meetings from "@/components/Meetings";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard p-8">
        <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="hover:no-underline border px-4 ">
              <div className="grid grid-cols-4 w-full  ">
                <div className="">Tasks</div>
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div> High
                  priority
                </div>
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>{" "}
                  Medium priority
                </div>
                <div className="flex items-center gap-2">
                  {" "}
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div> Low
                  priority
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <TaskList />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-none">
            <AccordionTrigger className="hover:no-underline border px-4 ">
              Inbox
            </AccordionTrigger>
            <AccordionContent>
              <Inbox />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-none" >
            <AccordionTrigger className="hover:no-underline border px-4 ">
              Meetings
            </AccordionTrigger>
            <AccordionContent>
              <Meetings />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Dashboard;
