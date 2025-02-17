import { google } from "googleapis";
import prisma from "@/lib/prisma";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL;

export async function getNewAccessToken(userId: string) {
  try {
    // Fetch the refresh token from the database
    const account = await prisma.account.findUnique({
      where: { userId },
      select: { refresh_token: true },
    });

    if (!account?.refresh_token) {
      throw new Error("No refresh token found. User needs to reauthorize.");
    }

    // Initialize OAuth2 client
    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    auth.setCredentials({ refresh_token: account.refresh_token });

    // Get a new access token
    const { credentials } = await auth.refreshAccessToken();

    // Update the access token in the database
    await prisma.account.update({
      where: { userId },
      data: { access_token: credentials.access_token, expiry_date: credentials.expiry_date },
    });

    return credentials.access_token;
  } catch (error: any) {
    console.error("Error refreshing access token:", error.message);
    return null;
  }
}
