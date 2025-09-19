// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import FlightTakeoffOutlined from '@mui/icons-material/FlightTakeoffOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import AppleIcon from '@mui/icons-material/Apple';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import OrdersTable from 'sections/dashboard/default/OrdersTable';
import { useEffect, useState } from 'react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [analysis, setAnalysis] = useState({});

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/analysis/lists`);
        console.log('Analysis Data: ==========>', response);
        if (response?.data?.success) {
          setAnalysis(response.data);
          console.log('Analysis Data: ==========>', response.data);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          color="primary"
          title="Total Registered Jets"
          count={analysis?.data?.aircraft ?? 0}
          percentage={59.3}
          icon={<FlightTakeoffOutlined />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          color="success"
          title="Total Team Members"
          count={analysis?.data?.team ?? 0}
          percentage={12.4}
          icon={<GroupOutlined />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          color="warning"
          title="Total Reviews"
          count={analysis?.data?.review ?? 0}
          percentage={27.4}
          isLoss
          icon={<StarBorderRounded />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce color="info" title="Working Brands" count={analysis?.data?.brand ?? 0} percentage={5.1} icon={<AppleIcon />} />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 */}
      <Grid size={{ xs: 12 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Latest Jets</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
