import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

function PieChartList({ data }) {
  const pieData = data.map((item, index) => ({
    id: index,
    value: item.sumUserYear,
    label: `${item.requester}`,
    
  }))

  const size = {
    // width: 550,
    height: 200,
  };

  return (
    <div>  
      <Typography variant="h6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>รายบุคคล</Typography>
      <PieChart
        series={[
          {
            data: pieData,
          },
        ]}
        
        {...size}
      />
    </div>
  );
}

export default PieChartList;
