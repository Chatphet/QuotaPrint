import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function PieChartYear({ data }) {

  const pieData = data.flatMap(item => [
    {
      id: `BlackWhite-${item.Year}`,
      value: item.TotalBlackWhite,
      label: `Black & White ${item.Year}`,
    },
    {
      id: `Color-${item.Year}`,
      value: item.TotalColor,
      label: `Color ${item.Year}`,
    }
  ]);

  return (
    <div>
      <PieChart
        series={[
          {
            data: pieData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={200}
      />
    </div>
  );
}

export default PieChartYear;