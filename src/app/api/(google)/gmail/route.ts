import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getNewAccessToken } from "../refreshAccessToken/route";


export async function GET(req: NextRequest) {
  try {
    const userId = 'something'

    // const account = await prisma.account.findUnique({
    //   where: { userId: null },
    //   select: { access_token: true, refresh_token: true, expires_at: true },
    // });

    // if(!account)
    //   return NextResponse.json({ error: "Account not found" }, { status: 404 });

    // let accessToken = account.access_token

    // if(account.expires_at && account.expires_at < Date.now()) {
    //   const newAccessToken = await getNewAccessToken(userId);

    //   if(!newAccessToken)
    //     return NextResponse.json({ error: "Failed to refresh access token" }, { status: 500 });
      
    //   accessToken = newAccessToken
    // }

    let accessToken = 'ya29.a0AXeO80QhmFbJC6NmNpTrM0EW-Ay1mGMFiNnejBLUe83caycIuB9iWuivtOwaybcXcTQSHgPXhKITioB_1LSNo3_-f0XtytjRLKsfg6n135qmIPHtb1p6M3zknJwzVkDa9wn7RXd-Ct5H657Gv7twKgJTG8g2dl9jTt8SOu-maCgYKAeYSARESFQHGX2Mikb-gxrfsYf3ojnDpjijWYQ0175'

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });
    const response = await gmail.users.messages.list({ userId: "me", maxResults: 20, q: "in:inbox"})
    if (!response.data.messages) {
      return NextResponse.json({ error: "No messages found" }, { status: 404 });
    }

    const messages = await Promise.all(
        response.data.messages.map(async (msg) => {

          const message = await gmail.users.messages.get({ userId: "me", id: msg.id as string });
          // console.log('message', message.data.payload?.headers);
          return {
            id: msg.id,
            body: message.data.snippet,
            subject: message.data.payload?.headers?.find((h) => h.name === "Subject")?.value || "No Subject",
            date: message.data.payload?.headers?.find((h) => h.name === "Date")?.value || "No Date",
            from: message.data.payload?.headers?.find((h) => h.name === "From")?.value || "No From",
          };
        })
      )

    return NextResponse.json(messages || []);
  } catch (error: any) {
    console.error("Error in GET emails api : ", error.message);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}