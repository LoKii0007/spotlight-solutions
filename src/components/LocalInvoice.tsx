import { convertNumberToWords } from "@/utils/NumberToWords";
import React from "react";

const LocalInvoice = () => {
  return (
    <>
      <div className="w-[794px] h-[1123px] p-12 bg-white text-black text-sm">
        <div className="flex flex-col border border-b-black ">
          <div className="h-5 bg-blue-500"></div>
          <div className="py-2 text-center text-2xl font-bold border border-black">
            Tax Invoice
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1 border border-black p-1">
              <div className="flex flex-col gap-1">
                <h6 className="font-bold">Name of the supplier</h6>
                <p>Company Name</p>
                <p>Address</p>
              </div>
              <div>
                <p>GSTIN :</p>
                <p>IE code :</p>
                <div className="w-full grid grid-cols-2 gap-1">
                  <p>Tel. no :</p>
                  <p>Email :</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 border border-black p-1">
              <p>Invoice No :</p>
              <p>Invoice Date :</p>
              <p>Agreement Ref No :</p>
              <p>Agreement Date :</p>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1 border border-black p-1">
              <h6 className="underline font-bold">
                Name of the Customer(Billed to)
              </h6>
              <p>Customer Name</p>
              <p>Address</p>

              <h6 className="font-bold">GSTIN :</h6>
            </div>
            <div className="flex flex-col gap-1 border border-black p-1">
              <h5 className="font-bold">Service mode : </h5>
            </div>
          </div>

          {/* coulmns  */}
          <div className="grid grid-cols-2 w-full">
            <div className="flex w-full item-top">
              <div className="w-[10%] border  border-black center   ">
                S.No
              </div>
              <div className="w-[50%] border  border-black center   ">
                Description of goods
              </div>
              <div className="w-[20%] border  border-black center   ">
                HSN/SAC
              </div>
              <div className="w-[20%] border  border-black center   ">
                Value
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-2/3 flex flex-col">
                <div className="w-full center border border-black">GST</div>
                <div className="w-full flex">
                  <div className="w-1/2 border border-black center">Rate</div>
                  <div className="w-1/2 border border-black center">
                    Tax Amount
                  </div>
                </div>
              </div>
              <div className="w-1/3 border border-black center">
                Total Amount <br /> (including tax)
              </div>
            </div>
          </div>

          {/* values */}
          <div className="w-full grid grid-cols-2 h-[10vh]">
            <div className="flex w-full item-bottom h-full">
              <div className="w-[10%] border-x center border-black">1</div>
              <div className="w-[50%] border-x center border-black">
                Description
              </div>
              <div className="w-[20%] border-x center border-black">SAC</div>
              <div className="w-[20%] border-x center border-black">123</div>
            </div>
            <div className="flex w-full">
              <div className="w-2/3 flex">
                <div className="w-1/2 border-x center border-black">CGST</div>
                <div className="w-1/2 border-x center border-black">SGST</div>
              </div>
              <div className="w-1/3 border-x center border-black">123</div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center p-1 border border-black">
            <p className="font-bold ">Grand Total</p>
            <p className="font-bold ">$ 43,000.00</p>
          </div>

          <div className="w-full p-1 border border-black">
            <p className="font-bold text-right"> {convertNumberToWords(43000, 'India')} </p>
          </div>

          <div className="w-full flex flex-col gap-1 p-1 border border-black">
            <p className="font-bold underline">Remittance Instruction</p>
            <div className="flex">
              <p className="w-1/4">Beneficiary Name </p>
              <p>: Company Name</p> 
            </div>
            <div className="flex">
              <p className="w-1/4">Account Number </p>
              <p>: 1234567890</p>
            </div>
            <div className="flex">
              <p className="w-1/4">Swift Code </p>
              <p>:  Bank Name</p>
            </div>
            <div className="flex">
              <p className="w-1/4">IFS Code </p>
              <p>: Bank Address</p>
            </div>
            <div className="flex">
              <p className="w-1/4">Address of bank </p>
              <p>: Bank Address</p>
            </div>
          </div>

          <p className="w-full border border-black p-1">
            <span className="font-bold">Remarks :</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LocalInvoice;
