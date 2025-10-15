"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContentSection } from "@/models/Company";
import { SectionPreview } from "../edit/components/SectionPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export default function CompanyPreviewPage() {
  const router = useRouter();
  const { user, loading: isAuthLoading } = useAuthStore((s) => ({ user: s.user, loading: s.loading }));
  const params = useParams<{ company: string }>();
  const slug = useMemo(() => params?.company ?? "company", [params]);
  
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    if (isAuthLoading) return; // Wait for auth state to load

    if (user && user.role === 'CANDIDATE') {
      toast.error("You are not authorized to access this page.");
      router.push(`/${slug}/careers`);
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await axiosInstance.get(`/api/company/${encodeURIComponent(slug)}/edit`);
        if (!active) return;
        const c = res.data;
        setCompany(c);
        setSections(Array.isArray(c.sections) ? c.sections : []);
      } catch (e: any) {
        if (e.response?.status === 401 || e.response?.status === 403) {
          toast.error("You are not authorized to preview this page");
          router.push(`/${slug}/careers`);
        } else {
          toast.error(e?.message || "Failed to load company");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug, user, isAuthLoading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading preview...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/${slug}/edit`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editor
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              Preview: {company?.name || slug}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {company?.isPublished ? "Published" : "Draft"}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="mx-auto max-w-none">
        {sections.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No content sections yet</h2>
              <p className="text-muted-foreground mb-4">
                Add sections in the Page Builder to see your careers page come to life.
              </p>
              <Link href={`/${slug}/edit`}>
                <Button>Start Building</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {sections.map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
