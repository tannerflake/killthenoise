import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IssueTable from '../components/IssueTable';
import IntegrationStatus from '../components/IntegrationStatus';
import StatsCards from '../components/StatsCards';

interface Issue {
  id: number;
  title: string;
  description?: string;
  source: string;
  severity: number;
  frequency: number;
  status: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Issue[];
  count: number;
}

const Dashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalIssues: 0,
    criticalIssues: 0,
    openIssues: 0,
    avgSeverity: 0
  });

  useEffect(() => {
    fetchTopIssues();
  }, []);

  const fetchTopIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>('/api/issues/top?limit=10');
      
      if (response.data.success) {
        setIssues(response.data.data);
        
        // Calculate stats
        const totalIssues = response.data.data.length;
        const criticalIssues = response.data.data.filter(issue => issue.severity >= 4).length;
        const openIssues = response.data.data.filter(issue => issue.status === 'open').length;
        const avgSeverity = totalIssues > 0 
          ? response.data.data.reduce((sum, issue) => sum + issue.severity, 0) / totalIssues 
          : 0;

        setStats({
          totalIssues,
          criticalIssues,
          openIssues,
          avgSeverity: Math.round(avgSeverity * 10) / 10
        });
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runIntegrationTest = async () => {
    try {
      setLoading(true);
      await axios.post('/api/integrations/test');
      // Refresh issues after integration test
      await fetchTopIssues();
    } catch (err) {
      console.error('Error running integration test:', err);
      setError('Failed to run integration test.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <div className="text-center">
              <h3>Error</h3>
              <p className="text-danger">{error}</p>
              <button className="btn btn-primary" onClick={fetchTopIssues}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header mb-4">
          <div className="d-flex justify-between align-center">
            <div>
              <h1>Product Issue Dashboard</h1>
              <p className="text-secondary">
                AI-powered issue triage and prioritization
              </p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={runIntegrationTest}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run Integration Test'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Issues Table - Full Width */}
          <div className="card">
            <div className="card-header">
              <h3>Top Product Issues</h3>
              <p className="text-secondary mb-0">
                Ranked by frequency and severity
              </p>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center p-4">
                  <p>Loading issues...</p>
                </div>
              ) : (
                <IssueTable issues={issues} />
              )}
            </div>
          </div>

          {/* Integration Status - Below Issues Table */}
          <div className="integration-status-section">
            <IntegrationStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 