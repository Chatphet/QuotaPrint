import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function PieChartList({ data }) {
  const pieData = data.map((item, index) => ({
    id: index,
    value: item.sumAll,
    label: item.requester,
  })).sort((a, b) => a.label.localeCompare(b.label));
  
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

export default PieChartList;