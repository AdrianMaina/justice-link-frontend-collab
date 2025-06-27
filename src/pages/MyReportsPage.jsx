import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, ShieldCheck, ShieldX, Hourglass } from 'lucide-react';
import { apiService } from '../apiService';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth(); // Get authentication status

  useEffect(() => {
    // Define the function to fetch reports
    const fetchReports = async () => {
      console.log("MyReportsPage: Starting to fetch reports..."); // Log start
      setIsLoading(true);
      setError('');
      try {
        const data = await apiService.getMyReports();
        console.log("MyReportsPage: Successfully fetched data:", data); // Log success
        setReports(data);
      } catch (err) {
        console.error("MyReportsPage: Error fetching reports:", err); // Log the actual error object
        setError('Failed to fetch your reports. Please check the console for more details.');
      } finally {
        setIsLoading(false);
        console.log("MyReportsPage: Finished fetching reports."); // Log end
      }
    };

    // Only attempt to fetch if the user is authenticated
    if (isAuthenticated) {
      fetchReports();
    } else {
      // If the user is somehow on this page without being logged in
      setError("You must be logged in to view your reports.");
      setIsLoading(false);
    }
  }, [isAuthenticated]); // Rerun the effect if authentication status changes
  
  const getStatusInfo = (status) => {
    switch(status) {
      case 'Verified':
        return {
          badge: 'secondary',
          icon: <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />,
          message: 'This report has been verified. We are taking the necessary actions and may reach out if more information is needed.'
        };
      case 'Rejected':
        return {
          badge: 'destructive',
          icon: <ShieldX className="h-4 w-4 mr-2 text-red-500" />,
          message: 'This report could not be verified with the information provided. It will not be processed further.'
        };
      default: // Pending
        return {
          badge: 'outline',
          icon: <Hourglass className="h-4 w-4 mr-2 text-yellow-500" />,
          message: 'This report is pending review by our team. Thank you for your patience.'
        };
    }
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Submitted Reports</CardTitle>
          <CardDescription>Track the status and outcome of your reports here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="space-y-6">
              {reports.length > 0 ? reports.map(report => {
                const statusInfo = getStatusInfo(report.status);
                return (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <Badge variant={statusInfo.badge}>{report.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Submitted on: {new Date(report.date_of_incident).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground mb-4">{report.description}</p>
                    <div className="bg-muted/50 p-3 rounded-md flex items-center">
                        {statusInfo.icon}
                        <p className="text-sm text-foreground">{statusInfo.message}</p>
                    </div>
                  </div>
                )
              }) : (
                <p className="text-center text-muted-foreground py-8">You have not submitted any reports yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}