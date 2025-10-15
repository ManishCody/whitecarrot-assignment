"use client";

import { ContentSection } from "@/models/Company";
import Image from 'next/image';

interface SectionPreviewProps {
  section: ContentSection;
  company?: { bannerUrl?: string; logoUrl?: string; cultureVideo?: string };
}

export function SectionPreview({ section, company }: SectionPreviewProps) {
  const getSizeClasses = () => {
    switch (section.size) {
      case 'small': return 'py-8';
      case 'large': return 'py-20';
      default: return 'py-12';
    }
  };

  const getAlignmentClasses = () => {
    switch (section.alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        const bg = company?.bannerUrl || section.imageUrl || "";
        return (
          <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-none">
            {bg && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bg})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
              {company?.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt="Company logo"
                  width={64}
                  height={64}
                  className="mx-auto mb-4 h-16 w-16 rounded-md bg-white/90 p-2 shadow"
                />
              ) : null}
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{section.title}</h1>
              <p className="text-lg md:text-xl opacity-90">{section.content}</p>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
            <div className="prose prose-lg max-w-none">
              <p>{section.content}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="max-w-4xl mx-auto px-4">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
            )}
            {section.imageUrl && (
              <Image 
                src={section.imageUrl} 
                alt={section.title || 'Section image'}
                width={1200}
                height={675}
                className="w-full rounded-lg"
              />
            )}
          </div>
        );

      case 'video':
        return (
          <div className="max-w-4xl mx-auto px-4">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
            )}
            {section.videoUrl && (
              <video controls className="w-full rounded-lg">
                <source src={section.videoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        );

      case 'values':
        const values = (section.data?.values ?? []) as { title: string; description: string }[];
        return (
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(values as any).map((value: { title: string; description: string }, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'locations':
        const locations = (section.data?.locations ?? []) as { city: string; address: string }[];
        return (
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location: { city: string; address: string }, index: number) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-6">
                  <div className="w-16 h-16 bg-yellow-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{location.city}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'perks':
        const perks = (section.data?.perks ?? []) as { title: string; description: string }[];
        return (
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {perks.map((perk: { title: string; description: string }, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-600">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gray-50 rounded-lg p-8">
              <blockquote className="text-lg italic mb-4">&quot;{section.content}&quot;</blockquote>
              <cite className="font-semibold">— {section.title}</cite>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{section.title}</h2>
            <p className="text-lg mb-8">{section.content}</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              View Jobs
            </button>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        );
    }
  };

  return (
    <section
      className={`${getSizeClasses()} ${getAlignmentClasses()}`}
      style={{
        backgroundColor: section.backgroundColor,
        color: section.textColor,
      }}
    >
      {renderContent()}
    </section>
  );
}
