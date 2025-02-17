import { convertNumberToWords } from "@/utils/NumberToWords";
import React from "react";

const Invoice: React.FC = () => {
  return (
    <>
      <div className=" w-[794px] h-[1123px] p-12 bg-white text-sm text-black flex flex-col gap-4">
        <div className="w-full text-right">
          <h1 className="text-3xl font-bold text-yellow-600">Invoice</h1>
          <p># INV/24-25/001</p>
        </div>

        <div className="w-full flex justify-between text-xs">
          <div>
            <p>Company Name</p>
            <p>Address</p>
            <p>CIN</p>
            <p>MAIL</p>
            <p>MOBILE</p>
          </div>
          <div>
            <p>Invoice Amount</p>
            <p>$ 43,000.00</p>
          </div>
        </div>

        <div className="my-8">
          <div className="flex justify-between">
            <div>
              <h1 className="text-base font-bold text-yellow-600">Bill To</h1>
              <p>customer name</p>
              <p>customer address</p>
            </div>
            <div className="w-1/2 text-right">
              <div className="grid grid-cols-2">
                <p className="text-yellow-600">Invoice Date:</p>
                <p>01/04/2024</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-yellow-600">Terms:</p>
                <p>Due on Receipt</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-yellow-600">Due Date:</p>
                <p>01/04/2024</p>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-white p-2">#</th>
              <th className="border border-white p-2 text-left">Description</th>
              <th className="border border-white p-2 text-right">HSN/SAC</th>
              <th className="border border-white w-[20%] p-2 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-center">1</td>
              <td className="border p-2">Description of services</td>
              <td className="border p-2 text-right">998314</td>
              <td className="border w-[20%] p-2 text-right">290.03</td>
            </tr>
          </tbody>
        </table>

        <div className="flex w-full flex-col">
          <div className="flex w-full justify-end">
            <p className="text-right p-2">Sub Total</p>
            <p className="w-[20%] text-right p-2">$290.03</p>
          </div>

          <div className="flex w-full justify-end font-bold">
            <p className="text-right p-2">Total</p>
            <p className="w-[20%] text-right p-2">$290.03</p>
          </div>

          <div className="flex w-full justify-end font-bold">
            <p className="text-right ps-12 p-2 bg-gray-200">Balance Due</p>
            <p className="w-[20%] text-right p-2 bg-gray-200">$290.03</p>
          </div>

          <div className="flex w-full justify-end font-bold p-2">
            {convertNumberToWords(290, "US")}
          </div>
        </div>

        <div className="mb-8">
          <strong>Notes</strong>
          <p>THANK YOU FOR YOUR BUSINESS!</p>
        </div>
        <div>
          <strong>Terms & Conditions</strong>
          <p>If any</p>
        </div>
      </div>
    </>
  );
};

export default Invoice;
