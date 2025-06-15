
"use client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";



export default  function Home() {
 const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log("User token:", token);
    };

    if (isLoaded) {
      fetchToken();
    }
  }, [isLoaded]);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
    </div>
  );
}
