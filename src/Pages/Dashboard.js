import React, { useEffect, useRef } from 'react';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

const Dashboard = () => {
  const dashboardContainer = useRef(null);

  useEffect(() => {
    // Create an instance of the ChartsEmbedSDK with your correct base URL
    const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-query_tester-hnjgdtd', // Replace with your actual base URL
    });

    // Create the dashboard instance using your dashboard ID
    const dashboard = sdk.createDashboard({
      dashboardId: '27c91e2b-024c-4fbb-b519-df51b8a78bd0', // Replace with your actual dashboard ID
      height: '800px',
      width: '100%',
      theme: 'light',
    });

    // Render the dashboard into the container
    dashboard.render(dashboardContainer.current).catch(err => {
      console.error('Error rendering dashboard:', err);
    });
  }, []);

  return (
    <div>
      <h2>My MongoDB Dashboard</h2>
      <div ref={dashboardContainer} style={{ margin: '20px auto' }} />
    </div>
  );
};

export default Dashboard;