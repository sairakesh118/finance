"use client";
import AuthInitializer from "./AuthInitializer";

export default function LayoutClientWrapper({ children }) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
