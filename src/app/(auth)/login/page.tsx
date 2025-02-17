"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res : any = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.status === 200) {
        toast.success("Login successful");
        console.log('res', res);
        router.push("/dashboard");
      }
      else{
        toast.error(res?.error);
      }
    } catch (error) {
      toast.error("Login failed:");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-bg">
      <Card className="w-full max-w-md">
        {/* Logo and Company Name */}
        <CardHeader className="flex flex-col items-center justify-center gap-10">
          <div className="flex items-center justify-center gap-2">
            {/* <img src="/logo.png" alt="Spotlight Strategic Solutions" className="w-5 h-5" /> */}
            <h1 className="text-2xl font-bold -ml-2">
              Spotlight Strategic Solutions
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-center text-[#1a365d]">
            Welcome back!
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 "
              onClick={() => console.log("Google sign in")}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt=""
                className="w-4 h-4"
              />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => console.log("Microsoft sign in")}
            >
              <img
                src="https://www.microsoft.com/favicon.ico"
                alt=""
                className="w-4 h-4"
              />
              Sign in with Microsoft
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

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@company.com"
                {...register("email")}
                className=""
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm text-muted-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className=" pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary w-full text-right"
              >
                Forgot password?
              </a>
            </div>

            <Button className="w-full py-5 text-base" type="submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log in"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              No account yet?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Create account for free
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
