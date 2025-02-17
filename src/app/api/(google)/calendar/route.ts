import { google } from "googleapis";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getNewAccessToken } from "../refreshAccessToken/route";

export async function GET(req: NextRequest) {
  try {

    const userId = 'something'

    const account = await prisma.account.findUnique({
      where: { userId: userId },
      select: { access_token: true, refresh_token: true, expires_at: true },
    });

    if(!account)
      return NextResponse.json({ error: "Account not found" }, { status: 404 });

    let accessToken = account.access_token

    if(account.expires_at && account.expires_at < Date.now()) {
      const newAccessToken = await getNewAccessToken(userId);
      if(!newAccessToken)
        return NextResponse.json({ error: "Failed to refresh access token" }, { status: 500 });
      accessToken = newAccessToken
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    // Get start & end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setMonth(tomorrow.getMonth() + 10);

    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(), // Get only today's events
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(data.items || []);
  } catch (error: any) {
    console.error("Error in GET calendar api : ", error.message);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }


}

export async function POST(req: NextRequest) {
    try {
      const accessToken = req.headers.get("Authorization")?.split(" ")[1];
      if (!accessToken)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { title, start, end, description } = await req.json();
      if (!title || !start || !end)
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
  
      const calendar = google.calendar({ version: "v3", auth });
  
      const event = {
        summary: title,
        description: description || "",
        start: { dateTime: new Date(start).toISOString(), timeZone: "UTC" },
        end: { dateTime: new Date(end).toISOString(), timeZone: "UTC" },
      };
  
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
  
      return NextResponse.json(response.data, { status: 201 });
    } catch (error: any) {
      console.error("Error in POST event api : ", error.message);
      return NextResponse.json(
        { error: "Failed to add event" },
        { status: 500 }
      );
    }

}