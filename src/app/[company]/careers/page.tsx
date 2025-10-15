import type { Metadata } from "next";
import { getCompanyBySlug } from "@/lib/controllers/company-controller";
import { JobsList } from "./components/JobsList";
import { SectionPreview } from "../../(recruiter)/[company]/edit/components/SectionPreview";
import { ContentSection } from "@/models/Company";

type PageProps = {
  params: { company: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const company = await getCompanyBySlug((await params).company).catch(() => null);
  const title = company ? `${company.name} — Careers` : `Careers`;
  const description = company
    ? `Explore open roles and learn about ${company.name}. Join our team and make an impact.`
    : `Explore open roles and learn more about this company.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourapp.com';
  const canonicalUrl = `${baseUrl}/${(await params).company}/careers`;
  
  return {
    title,
    description,
    keywords: company ? [
      company.name,
      'careers',
      'jobs',
      'employment',
      'hiring',
      'work',
      'opportunities'
    ] : ['careers', 'jobs'],
    authors: [{ name: company?.name || 'Company' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: company?.name || 'Careers',
      images: company?.bannerUrl ? [{
        url: company.bannerUrl,
        width: 1200,
        height: 630,
        alt: `${company.name} careers page banner`
      }] : [],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: company?.bannerUrl ? [company.bannerUrl] : [],
      creator: '@yourcompany',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function CareersPage({ params }: PageProps) {
  const companySlug = (await params).company;

  let company: any = null;
  let sections: ContentSection[] = [];
  
  try {
    company = await getCompanyBySlug(companySlug);
    sections = Array.isArray(company?.sections) ? company.sections : [];
  } catch (e) {
  }

  if (!company) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground">
            The careers page for "{companySlug}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!company.isPublished) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground">
            {company.name}'s careers page is not yet published.
          </p>
        </div>
      </div>
    );
  }
  const clientCompany = {
    bannerUrl: company.bannerUrl as string | undefined,
    logoUrl: company.logoUrl as string | undefined,
    cultureVideo: company.cultureVideo as string | undefined,
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company.name,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourapp.com'}/${companySlug}/careers`,
    "logo": company.logoUrl || undefined,
    "description": `Explore career opportunities at ${company.name}. Join our team and make an impact.`,
    ...(company.bannerUrl && { "image": company.bannerUrl }),
    "sameAs": [],
    "jobPosting": {
      "@type": "JobPosting",
      "hiringOrganization": {
        "@type": "Organization",
        "name": company.name,
        "logo": company.logoUrl || undefined
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen bg-white">
        {sections.length > 0 ? (
          <div className="space-y-0">
            {sections.map((section) => (
              <SectionPreview key={section.id} section={section} company={clientCompany} />
            ))}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">About {company.name}</h1>
            </header>

            <section className="prose prose-lg max-w-none mb-12">
              <p>
                We're building the future and looking for talented individuals to join our team. 
                Explore our open roles below and discover how you can make an impact.
              </p>
            </section>
          </div>
        )}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Join the team, we're hiring!</h2>
              <p className="text-muted-foreground">
                Explore our open positions and find your next opportunity.
              </p>
            </div>
            <JobsList slug={companySlug} />
          </div>
        </section>
      </div>
    </>
  );
}
