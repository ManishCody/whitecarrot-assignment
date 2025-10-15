"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentSection } from "@/models/Company";
import { PageBuilder } from "./components/PageBuilder";
import { JobsAdmin } from "./components/JobsAdmin";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export default function CompanyEditPage() {
  const router = useRouter();
  const params = useParams<{ company: string }>();
  const slug = useMemo(() => params?.company ?? "company", [params]);

  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cultureVideoUrl, setCultureVideoUrl] = useState("");
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const { user, loading: isAuthLoading } = useAuthStore((s) => ({ user: s.user, loading: s.loading }));

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
        setCompanyName(c.name ?? "");
        setPrimaryColor(c.primaryColor ?? "#0ea5e9");
        setBannerUrl(c.bannerUrl ?? "");
        setLogoUrl(c.logoUrl ?? "");
        setCultureVideoUrl(c.cultureVideo ?? "");
        setSections(Array.isArray(c.sections) ? c.sections : []);
        setIsPublished(c.isPublished ?? false);

              } catch (e: any) {
        if (e.response?.status === 401 || e.response?.status === 403) {
          toast.error("You are not authorized to edit this page");
          router.push(`/${slug}/careers`);
        } else if (e.response?.status !== 404) { // 404 is okay, it means we're creating a new company
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

  const onSave = async () => {
    try {
      const payload = {
        name: companyName || slug,
        slug,
        logoUrl,
        bannerUrl,
        cultureVideo: cultureVideoUrl,
        primaryColor,
        sections,
      };

      try {
        await axiosInstance.put(`/api/company/${encodeURIComponent(slug)}`, payload);
      } catch (e: any) {
        if (e.response?.status === 404) {
          await axiosInstance.post("/api/company", payload);
        } else {
          throw e;
        }
      }

      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    }
  };

  const onPreview = () => {
    router.push(`/${slug}/preview`);
  };

  const onPublish = async () => {
    try {
      const method = isPublished ? "delete" : "post";
      const res = await axiosInstance[method](`/api/company/${encodeURIComponent(slug)}/publish`);
      const updatedCompany = res.data;
      setIsPublished(updatedCompany.isPublished);
      toast.success(isPublished ? "Page unpublished" : "Page published! Share your careers link.");
    } catch (e: any) {
      toast.error(e?.message || "Publish failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Careers Page</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onPreview}>
            Preview Page
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Loading..." : "Save Changes"}
          </Button>
          <Button 
            onClick={onPublish} 
            disabled={loading}
            variant={isPublished ? "destructive" : "default"}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Page Builder</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="settings">Brand Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="mt-6">
          <div className="min-h-[600px]">
            <PageBuilder
              sections={sections}
              onSectionsChange={setSections}
              companySlug={slug}
              loading={loading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6">
          <JobsAdmin slug={slug} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Brand Theme</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Banner Image URL</label>
                  <Input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Logo URL</label>
                  <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Culture Video URL</label>
                  <Input value={cultureVideoUrl} onChange={(e) => setCultureVideoUrl(e.target.value)} placeholder="https://..." />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
