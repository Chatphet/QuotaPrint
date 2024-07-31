import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

function PieChartList({ data }) {
  const pieData = data.map((item, index) => ({
    id: index,
    value: item.sumUserYear,
    label: `${item.requester} ${item.sumUserYear} แผ่น`,
    
  }))

  return (
    <div>  
      <Typography variant="h6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>รายบุคคล</Typography>
      <PieChart
        series={[
          {
            data: pieData,
          },
        ]}
        height={220}
      />
    </div>
  );
}

export default PieChartList;
