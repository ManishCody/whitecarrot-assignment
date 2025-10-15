"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';

export function CandidateSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { companies, isLoading, isError } = useCompanies(page, searchQuery);

  const totalPages = companies?.total ? Math.ceil(companies.total / companies.limit) : 1;

  return (
    <div role="main" aria-labelledby="discover-companies-heading">
      <h2 id="discover-companies-heading" className="mt-6 text-xl font-semibold">Discover Companies</h2>
      <div className="mt-4">
        <label htmlFor="company-search" className="sr-only">
          Search for companies by name or job title
        </label>
        <Input
          id="company-search"
          placeholder="Search by company or job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-describedby="search-help"
          autoComplete="off"
        />
        <div id="search-help" className="sr-only">
          Type to search for companies by name or available job titles. Results will update automatically as you type.
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="touch-manipulation">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-red-500 col-span-full">Failed to fetch companies.</p>
        ) : (
          <div 
            className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="region"
            aria-label="Company search results"
            aria-live="polite"
          >
            {companies?.companies?.length === 0 && (
              <div className="col-span-full text-center py-8" role="status">
                <p className="text-sm text-muted-foreground">No companies found.</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search terms</p>
              </div>
            )}
            {companies?.companies?.map((company: any, index: number) => (
              <Link 
                key={company._id} 
                href={`/${company.slug}/careers`} 
                className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label={`View ${company.name} careers page with ${company.jobCount} available ${company.jobCount === 1 ? 'job' : 'jobs'}`}
              >
                <Card className="hover:shadow-md active:shadow-lg transition-all duration-200 touch-manipulation h-full focus-within:ring-2 focus-within:ring-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight">{company.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground" aria-label={`${company.jobCount} available positions`}>
                        {company.jobCount} {company.jobCount > 1 ? 'jobs' : 'job'}
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full" aria-hidden="true">
                        View Jobs
                      </span>
                    </div>
                    {company.jobTitles && company.jobTitles.length > 0 && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed" aria-label={`Available positions: ${company.jobTitles.join(', ')}`}>
                        {company.jobTitles.join(' • ')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {searchQuery.length < 2 && totalPages > 1 && (
        <nav className="mt-4 flex justify-between items-center" aria-label="Company list pagination">
          <Button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            aria-label={page === 1 ? "Previous page (disabled)" : "Go to previous page"}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
            Page {page} of {totalPages}
          </span>
          <Button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
            aria-label={page === totalPages ? "Next page (disabled)" : "Go to next page"}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}
