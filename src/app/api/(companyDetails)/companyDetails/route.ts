import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const companyDetails = await prisma.companyDetails.findFirst();
        return NextResponse.json(companyDetails);
    } catch (error: any) {
        console.log('Error in getting company details API', error.message);
        return NextResponse.json({ error: "Internal Error in getting company details API" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const data = await req.json();

    try {
        const updatedCompanyDetails = await prisma.companyDetails.update(data)
    } catch (error: any) {
        console.log('Error in updating company details API', error.message);
        return NextResponse.json({ error: "Internal Error in updating company details API" }, { status: 500 });
    }
}
