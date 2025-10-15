"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CandidateSearch } from "./components/CandidateSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading: isAuthLoading } = useAuthStore((s) => ({ user: s.user, loading: s.loading }));
  const router = useRouter();
  const [stats, setStats] = useState({ totalCompanies: 0, totalJobs: 0, totalApplications: 0 });
  const [applications, setApplications] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [viewApplicationsOpen, setViewApplicationsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companyApplications, setCompanyApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return; // Wait for the auth state to load
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === 'RECRUITER') {
          const [statsRes, companiesRes] = await Promise.all([
            axiosInstance.get('/api/dashboard/recruiter-stats'),
            axiosInstance.get('/api/companies')
          ]);
          setStats(statsRes.data);
          setCompanies(companiesRes.data);
        } else {
          const res = await axiosInstance.get('/api/applications/my-applications');
          setApplications(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthLoading, router]);

  const handleViewApplications = async (company: any) => {
    setSelectedCompany(company);
    setViewApplicationsOpen(true);
    setLoadingApplications(true);
    try {
      const res = await axiosInstance.get(`/api/company/${company.slug}/applications`);
      setCompanyApplications(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      const slug = newCompanyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const res = await axiosInstance.post('/api/companies', {
        name: newCompanyName,
        slug: slug
      });
      
      toast.success("Company created successfully!");
      setCreateCompanyOpen(false);
      setNewCompanyName("");
      
      router.push(`/${slug}/edit`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create company");
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-6 w-72" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.name}!</p>

      {user.role === 'RECRUITER' ? (
        <>
          <div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalCompanies}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalJobs}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalApplications}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Companies</h2>
                <Dialog open={createCompanyOpen} onOpenChange={setCreateCompanyOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Company</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Company</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={newCompanyName}
                          onChange={(e) => setNewCompanyName(e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setCreateCompanyOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCompany}>
                          Create Company
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {loading ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="mt-3 flex space-x-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {companies.map((company) => (
                    <Card key={company._id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {company.isPublished ? 'Published' : 'Draft'}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Link href={`/${company.slug}/edit`}>
                            <Button size="sm" variant="outline">Edit</Button>
                          </Link>
                          {company.isPublished && (
                            <Link href={`/${company.slug}/preview`}>
                              <Button size="sm" variant="outline">Preview</Button>
                            </Link>
                          )}
                          <Button size="sm" variant="secondary" onClick={() => handleViewApplications(company)}>View Applications</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Dialog open={viewApplicationsOpen} onOpenChange={setViewApplicationsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Applications for {selectedCompany?.name}</DialogTitle>
              </DialogHeader>
              {loadingApplications ? (
                <div className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto">
                  {companyApplications.length > 0 ? (
                    <pre className="bg-gray-100 p-4 rounded-md">
                      {JSON.stringify(companyApplications, null, 2)}
                    </pre>
                  ) : (
                    <p>No applications found for this company.</p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="discover">
            <CandidateSearch />
          </TabsContent>
          <TabsContent value="applications">
            <h2 className="mt-6 text-xl font-semibold">Your Applications</h2>
            {loading ? (
              <ul className="mt-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="rounded-md border bg-white p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-4 space-y-4">
                {applications.map((application) => {
                  if (!application.job) {
                    return null;
                  }
                  return (
                    <li key={application._id} className="rounded-md border bg-white p-4">
                      <p className="font-semibold">{application.job.title}</p>
                      <p className="text-sm text-muted-foreground">{application.status}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
