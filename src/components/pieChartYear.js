import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

function PieChartYear({ data }) {

  const sortedData = data.sort((a, b) => b.year - a.year);

  const pieData = sortedData.flatMap((item) => [
    {
      id: `BlackWhite-${item.year}`,
      value: item.totalBlackWhite,
      label: `Black&White ${item.year}`,
    },
    {
      id: `Color-${item.year}`,
      value: item.totalColor,
      label: `Color ${item.year}`,
    }
  ]);

  const size = {
    // width: 550,
    height: 200,
  };

  return (
    <div>
      <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>รายปี</Typography>
      <PieChart
        series={[
          {
            data: pieData,
            valueFormatter: (v) => `จำนวน ${v.value} แผ่น`,
          },
        ]}
        {...size}
      />
    </div>
  );
}

export default PieChartYear;
