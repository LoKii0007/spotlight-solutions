import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL;

interface TokenResponse {
  access_token: string;
  refresh_token?: string;  // Optional as it's not always returned
  token_type: string;     // Usually "Bearer"
  expiry_date: number;     // Seconds until access token expires
  scope: string;          // Granted scopes
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const userId = req.headers.get("Authorization")?.split(" ")[1] || 'someone';

    if (!code)
      return NextResponse.json({ error: "Missing auth code" }, { status: 400 });

    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    //@ts-ignore
    const { tokens } : TokenResponse = await auth.getToken(code);
    console.log("tokens : ", tokens);

    auth.setCredentials(tokens);

    //TODO: add access_token and refresh_token to the database

    const account = await prisma.account.create({
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date,
        // userId: userId
      }
    })

    if(!account)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });

    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

  } catch (error: any) {
    console.error("Error fetching access token API:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch access token API" },
      { status: 500 }
    );
  }

}
