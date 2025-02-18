import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email is already registered and verified.",
          }),
          { status: 400 }
        );
      }

      // If email is registered but not verified, update the user record
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPass = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPass,
          verifyCode: verificationCode,
          verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Verification code resent. Please check your email.",
        }),
        { status: 200 }
      );
    }

    // Create a new user for an unregistered email
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPass,
        verifyCode: verificationCode,
        verifyCodeExpiry: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 min
        emailVerified: false,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please check your email for verification.",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in signup api:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user.",
      }),
      { status: 500 }
    );
  }
}
