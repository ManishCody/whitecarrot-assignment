"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Milestone 2 scaffold: simple local form to sketch the editing experience.
// Persistence will be added in Milestone 3.
export default function CompanyEditPage() {
  const router = useRouter();
  const params = useParams<{ company: string }>();
  const slug = useMemo(() => params?.company ?? "company", [params]);

  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [cultureVideoUrl, setCultureVideoUrl] = useState("");
  const [sections, setSections] = useState("About Us, Life at Company");

  const onSave = () => {
    toast.success("Settings saved (local only)");
  };

  const onPreview = () => {
    router.push(`/${slug}/preview`);
  };

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Careers Page</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onPreview}>
            Preview
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>

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
          <CardTitle>Media</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <label className="text-sm text-muted-foreground">Comma-separated list</label>
          <Input
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            placeholder="About Us, Life at Company, Benefits"
          />
        </CardContent>
      </Card>
    </div>
  );
}
