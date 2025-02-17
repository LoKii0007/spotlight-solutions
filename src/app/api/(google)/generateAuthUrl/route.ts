import { google } from "googleapis";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL;
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/gmail.readonly"];

export async function GET() {
    try {
        console.log('CLIENT_ID', CLIENT_ID);
        const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        const authUrl = auth.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES,
          prompt: "consent"
        });
      
        return NextResponse.json({ authUrl });   
    } catch (error) {
        console.log('error in generate auth url api', error);
        return NextResponse.json({ error: "error in GET generate auth url api" }, { status: 500 });
    }
}
