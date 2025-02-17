"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Create a separate component for the content that uses useSearchParams
const AuthCallbackContent = () => {
  const params = useSearchParams();
  const [flag, setFlag] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const token: string = 'something';

  const fetchAccessToken = async (code: string) => {
    if (flag) return;
    try {
      const res = await axios.get(`/api/callback?code=${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.status !== 200) {
        toast({
          title: "Account verification failed",
        });
        return;
      }
      toast({
        title: "Account verified successfully",
      });
      setFlag(true);
    } catch (error) {
      console.error("Error fetching access token:", error);
      toast({
        title: "Account verification failed",
      });
    } finally {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      fetchAccessToken(code);
    }
  }, [fetchAccessToken, params]); // Added missing dependencies

  return (
    <div className="flex justify-center items-center h-full w-full">
      loading...
    </div>
  );
};


const AuthCallback = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-full w-full">
        loading...
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default AuthCallback;