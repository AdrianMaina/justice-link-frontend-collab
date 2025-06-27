import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Users, AlertTriangle, Eye, CheckCircle, X, Loader2, Newspaper, History } from 'lucide-react';
import { apiService } from '../apiService';
import { useAuth } from '../context/AuthContext';
import NewsManagement from '../components/NewsManagement';

export default function AdminPage() {
  const [pendingReports, setPendingReports] = useState([]);
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user?.is_admin) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const [reportsData, usersData] = await Promise.all([
        apiService.getReports(),
        apiService.getAllUsers(),
      ]);
      
      setPendingReports(reportsData.filter(r => r.status === 'Pending'));
      setVerifiedReports(reportsData.filter(r => r.status === 'Verified'));
      setRejectedReports(reportsData.filter(r => r.status === 'Rejected'));
      setAllUsers(usersData);
    } catch (err) {
      setError('Failed to fetch admin data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleVerifyReport = async (id) => {
    try {
        await apiService.verifyReport(id);
        fetchData(); // Refresh data after action
    } catch (err) {
        setError("Failed to verify report.");
    }
  };

  const handleRejectReport = async (id) => {
    try {
        await apiService.rejectReport(id);
        fetchData(); // Refresh data after action
    } catch (err) {
        setError("Failed to reject report.");
    }
  };

  if (!user?.is_admin) {
    return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
  }

  // A helper component to render report lists
  const ReportList = ({ title, reports, showActions = false }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length > 0 ? reports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold">{report.title}</h4>
                    <Badge variant={report.status === 'Verified' ? 'secondary' : report.status === 'Rejected' ? 'destructive' : 'outline'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Reported by: {report.author_username}</p>
                  <p className="text-xs text-muted-foreground">{new Date(report.date_of_incident).toLocaleString()}</p>
                </div>
                {showActions && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="secondary" onClick={() => handleVerifyReport(report.id)}><CheckCircle className="h-4 w-4 mr-1" />Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectReport(report.id)}><X className="h-4 w-4 mr-1" />Reject</Button>
                  </div>
                )}
              </div>
            </div>
          )) : (
              <p className="text-center text-muted-foreground py-4">No reports in this category.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Content moderation, verification, and user safety management
        </p>
      </div>

       {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
       {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports"><AlertTriangle className="h-4 w-4 mr-2"/>Report Management</TabsTrigger>
              <TabsTrigger value="news"><Newspaper className="h-4 w-4 mr-2"/>News Management</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-4 w-4 mr-2"/>User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <div className="flex justify-end mb-4">
                  <Button onClick={fetchData} variant="outline" size="sm">
                      Refresh Lists
                  </Button>
              </div>
              <ReportList title="Pending Reports" reports={pendingReports} showActions={true} />
              <ReportList title="Verified Reports" reports={verifiedReports} />
              <ReportList title="Rejected Reports" reports={rejectedReports} />
            </TabsContent>

            <TabsContent value="news">
              <NewsManagement />
            </TabsContent>

            <TabsContent value="users">
                <Card>
                    <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Monitor user activity and manage account status</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {allUsers.map((u) => (
                        <div key={u.id} className="border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{u.username}</h4>
                                {u.is_admin && <Badge variant="destructive">Admin</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                Email: {u.email}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">View Profile</Button>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
};