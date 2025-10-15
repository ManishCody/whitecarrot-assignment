"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { IJob } from "@/models/Job";

export function JobsList({ slug }: { slug: string }) {
  const { user, isAuthenticated } = useAuthStore((s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }));
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("slug", slug);
    if (location) p.set("location", location);
    if (jobType) p.set("jobType", jobType);
    if (title) p.set("title", title);
    return p.toString();
  }, [slug, location, jobType, title]);

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/jobs?${debouncedQuery}`);
        if (!active) return;
        const data = res.data;
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (e: unknown) {
        if (!(e as { message?: string })?.message?.includes('Unauthorized')) {
          toast.error((e as { message?: string })?.message || "Failed to fetch jobs");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    (async () => {
      try {
        const res = await axiosInstance.get('/api/applications/my-applications');
        const appliedJobIds = res.data.map((app: { job?: { _id?: string } }) => app.job?._id).filter(Boolean);
        setAppliedJobs(new Set(appliedJobIds));
      } catch (e: unknown) {
        if (!(e as { message?: string })?.message?.includes('Unauthorized')) {
          console.error("Failed to fetch applied jobs", e);
        }
      }
    })();
  }, [isAuthenticated, user]);

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await axiosInstance.post(`/api/jobs/${jobId}/apply`);
      toast.success("Application submitted!");
      setAppliedJobs(prev => new Set(prev).add(jobId));
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6" role="search" aria-labelledby="job-search-heading">
        <h3 id="job-search-heading" className="text-lg font-semibold mb-4">Find Your Perfect Role</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="job-title-search" className="text-sm font-medium text-gray-700">Search Jobs</label>
            <Input
              id="job-title-search"
              placeholder="e.g. Software Engineer, Designer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              aria-describedby="job-title-help"
              autoComplete="off"
            />
            <div id="job-title-help" className="sr-only">
              Search for jobs by title or keywords
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="location-search" className="text-sm font-medium text-gray-700">Location</label>
            <Input
              id="location-search"
              placeholder="e.g. New York, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
              aria-describedby="location-help"
              autoComplete="off"
            />
            <div id="location-help" className="sr-only">
              Filter jobs by location or select remote positions
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="job-type-select" className="text-sm font-medium text-gray-700">Job Type</label>
            <Select value={jobType || "ALL"} onValueChange={(v) => setJobType(v === "ALL" ? "" : v)}>
              <SelectTrigger id="job-type-select" aria-describedby="job-type-help">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <div id="job-type-help" className="sr-only">
              Filter jobs by employment type such as full-time, part-time, contract, or internship
            </div>
          </div>
        </div>
        {(title || location || jobType) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {title && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Title: {title}
                <button onClick={() => setTitle("")} className="ml-1 hover:text-blue-600">×</button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Location: {location}
                <button onClick={() => setLocation("")} className="ml-1 hover:text-green-600">×</button>
              </span>
            )}
            {jobType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Type: {jobType}
                <button onClick={() => setJobType("")} className="ml-1 hover:text-purple-600">×</button>
              </span>
            )}
          </div>
        )}
      </Card>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8" role="status">
          <p className="text-sm text-muted-foreground">No jobs found.</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div 
          className="space-y-3 sm:space-y-4"
          role="region"
          aria-label="Job listings"
          aria-live="polite"
        >
          {jobs.map((job) => (
            <Card key={job._id as string} className="p-4 sm:p-6 hover:shadow-md transition-shadow touch-manipulation focus-within:ring-2 focus-within:ring-blue-500">
              <article className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight mb-2" id={`job-title-${job._id}`}>{job.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
                      📍 {job.location}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
                      🏢 {job.department}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full">
                      ⏰ {job.jobType}
                    </span>
                  </div>
                  {job.salaryRange && (
                    <div className="text-sm font-medium text-green-600 mb-3">
                      💰 {job.salaryRange}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 sm:ml-4">
                  {isAuthenticated ? (
                    user?.role === 'CANDIDATE' && (
                      <Button 
                        onClick={() => handleApply(job._id as string)}
                        disabled={applying === job._id || appliedJobs.has(job._id as string)}
                        className="w-full sm:w-auto min-w-[100px] touch-manipulation"
                        size="sm"
                        aria-describedby={`job-title-${job._id}`}
                        aria-label={
                          appliedJobs.has(job._id as string) 
                            ? `Already applied to ${job.title}` 
                            : applying === job._id 
                              ? `Submitting application for ${job.title}` 
                              : `Apply for ${job.title} position`
                        }
                      >
                        {applying === job._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {appliedJobs.has(job._id as string) ? '✓ Applied' : (applying === job._id ? 'Applying...' : 'Apply Now')}
                      </Button>
                    )
                  ) : (
                    <Button 
                      onClick={() => window.location.href = '/login'}
                      className="w-full sm:w-auto min-w-[100px] touch-manipulation"
                      size="sm"
                      aria-label={`Login to apply for ${job.title} position`}
                    >
                      Login to Apply
                    </Button>
                  )}
                </div>
              </article>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
