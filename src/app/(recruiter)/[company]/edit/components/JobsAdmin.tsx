"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

interface JobsAdminProps {
  slug: string;
}

export function JobsAdmin({ slug }: JobsAdminProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // form fields
  const [title, setTitle] = useState("");
  const [workPolicy, setWorkPolicy] = useState("Remote");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [slugField, setSlugField] = useState("");

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      workPolicy.trim().length > 0 &&
      location.trim().length > 0 &&
      department.trim().length > 0 &&
      employmentType.trim().length > 0 &&
      experience.trim().length > 0 &&
      jobType.trim().length > 0 &&
      salaryRange.trim().length > 0 &&
      slugField.trim().length > 0
    );
  }, [title, workPolicy, location, department, employmentType, experience, jobType, salaryRange, slugField]);

  const resetForm = () => {
    setTitle("");
    setWorkPolicy("Remote");
    setLocation("");
    setDepartment("");
    setEmploymentType("Full-time");
    setExperience("");
    setJobType("Full-time");
    setSalaryRange("");
    setSlugField("");
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/jobs?slug=${encodeURIComponent(slug)}`);
      setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [slug]);

  const onCreate = async () => {
    if (!canSubmit) return;
    
    if (!workPolicy.trim()) {
      toast.error("Work Policy is required");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        companySlug: slug,
        title,
        workPolicy,
        location,
        department,
        employmentType,
        experience,
        jobType,
        salaryRange,
        slug: slugField,
      };
      await axiosInstance.post("/api/jobs", payload);
      toast.success("Job created");
      resetForm();
      await loadJobs();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeletingJobId(id);
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      toast.success("Job deleted");
      await loadJobs();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete job");
    } finally {
      setDeletingJobId(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Create Job Form */}
      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="text-base">Create Job</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Frontend Engineer" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Work Policy</label>
            <Select value={workPolicy} onValueChange={setWorkPolicy}>
              <SelectTrigger>
                <SelectValue placeholder="Select work policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Department</label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Employment Type</label>
            <Input value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} placeholder="Full-time" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Experience</label>
            <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="5+ years" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Job Type</label>
            <Input value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="Full-time" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Salary Range</label>
            <Input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="$120k–$160k" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium">Job Slug</label>
            <Input value={slugField} onChange={(e) => setSlugField(e.target.value)} placeholder="senior-frontend-engineer" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={onCreate} disabled={!canSubmit || submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle className="text-base">Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet. Create your first job using the form.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {jobs.map((job) => (
                <li key={job._id} className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.location} • {job.department} • {job.jobType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => onDelete(job._id)}
                        disabled={deletingJobId === job._id}
                      >
                        {deletingJobId === job._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {deletingJobId === job._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
