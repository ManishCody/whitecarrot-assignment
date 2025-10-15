"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { getCookie } from "@/lib/cookies";

export default function RecruiterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [checked, setChecked] = useState(false);

  const hasToken = useMemo(() => !!getCookie("wc_auth_token"), []);

  useEffect(() => {
    const id = setTimeout(() => {
      const authed = useAuthStore.getState().isAuthenticated || hasToken;
      if (!authed) {
        toast.error("Please login to continue");
        router.replace("/login?next=" + encodeURIComponent(pathname || "/"));
      } else {
        setChecked(true);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [router, pathname, hasToken]);

  if (!checked && !(isAuthenticated || hasToken)) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }

  return <>{children}</>;
}
