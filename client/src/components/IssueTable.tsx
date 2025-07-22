import React from 'react';

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

interface IssueTableProps {
  issues: Issue[];
}

const IssueTable: React.FC<IssueTableProps> = ({ issues }) => {
  const getSeverityBadge = (severity: number) => {
    if (severity >= 4) return <span className="badge badge-danger">Critical</span>;
    if (severity >= 3) return <span className="badge badge-warning">High</span>;
    if (severity >= 2) return <span className="badge badge-info">Medium</span>;
    return <span className="badge badge-success">Low</span>;
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'slack': return '💬';
      case 'hubspot': return '📊';
      case 'jira': return '🎫';
      case 'google_docs': return '📄';
      default: return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (issues.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-secondary">No issues found. Run an integration test to populate data.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Source</th>
            <th>Severity</th>
            <th>Frequency</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>
                <div>
                  <strong>{issue.title}</strong>
                  {issue.description && (
                    <p className="text-secondary text-sm mb-0">
                      {issue.description.length > 100 
                        ? `${issue.description.substring(0, 100)}...` 
                        : issue.description}
                    </p>
                  )}
                </div>
              </td>
              <td>
                <div className="d-flex align-center">
                  <span className="mr-2">{getSourceIcon(issue.source)}</span>
                  <span className="text-capitalize">{issue.source.replace('_', ' ')}</span>
                </div>
              </td>
              <td>
                {getSeverityBadge(issue.severity)}
              </td>
              <td>
                <strong>{issue.frequency}</strong>
                <span className="text-secondary text-sm"> reports</span>
              </td>
              <td>
                <span className={`badge ${issue.status === 'open' ? 'badge-warning' : 'badge-success'}`}>
                  {issue.status}
                </span>
              </td>
              <td>
                <div className="d-flex flex-wrap">
                  {issue.tags && issue.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="badge badge-info mr-1 mb-1">
                      {tag}
                    </span>
                  ))}
                  {issue.tags && issue.tags.length > 3 && (
                    <span className="badge badge-secondary">
                      +{issue.tags.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className="text-secondary text-sm">
                  {formatDate(issue.created_at)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable; 