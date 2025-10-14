"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyPreviewPage() {
  const params = useParams<{ company: string }>();
  const slug = useMemo(() => params?.company ?? "company", [params]);

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-semibold">Preview: {slug}</h1>
      <Card>
        <CardContent className="prose dark:prose-invert py-6">
          <div className="h-32 w-full rounded-md bg-muted" />
          <h2 className="mt-6">About Us</h2>
          <p>
            This is a placeholder preview. After we wire company data in the next milestone, this page will reflect
            brand theme, media, and content sections configured in the editor.
          </p>
          <h3 className="mt-6">Life at Company</h3>
          <p>
            Showcase culture, benefits, and values here. Videos and images will appear once media fields are saved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
