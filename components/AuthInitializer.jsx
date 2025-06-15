"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/store/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      if (token) {
        dispatch(setAuthToken(token));
      }
    };
    loadToken();
  }, []);

  return null; // or <></>
};

export default AuthInitializer;
