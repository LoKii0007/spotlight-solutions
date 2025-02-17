"use client"

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data: SignupFormInputs) => {
    setLoading(true);
    setMessage("");
    try {
      const response: any = await axios.post("/api/signup", data);
      if (response.status === 200) {
        toast.success("Signup successful");
        router.push("/login");
      } else {
        toast.error(response.data.message || "An error occurred. please try again.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center justify-center gap-10">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">
              Spotlight Strategic Solutions
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-center text-[#1a365d]">
            Create your account
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Sign-up Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt=""
                className="w-4 h-4"
              />
              Sign up with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("microsoft", { callbackUrl: "/" })}
            >
              <img
                src="https://www.microsoft.com/favicon.ico"
                alt=""
                className="w-4 h-4"
              />
              Sign up with Microsoft
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Sign-up Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">First Name</label>
                <Input
                  type="text"
                  {...register("firstName")}
                  className=""
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Last Name</label>
                <Input
                  type="text"
                  {...register("lastName")}
                  className=""
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Email address</label>
              <Input
                type="email"
                {...register("email")}
                className=""
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Password</label>
              <Input
                type="password"
                {...register("password")}
                className=""
              />
            </div>

            <Button disabled={loading} className="w-full py-5 text-base" type="submit">
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
