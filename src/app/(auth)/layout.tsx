import type { Metadata } from "next";
import React from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Auth | Whitecarrot",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid place-items-center bg-background p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
