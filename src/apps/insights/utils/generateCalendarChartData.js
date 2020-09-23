export function generateCalendarChartData(
   allowedCharts,
   transformedData,
   { chartTypeIndex, metrices, dateKeys }
) {
   let chartData = [[]]

   // add chart headers
   if (
      Array.isArray(allowedCharts) &&
      allowedCharts.length &&
      allowedCharts[chartTypeIndex] &&
      allowedCharts[chartTypeIndex].dateKeys &&
      allowedCharts[chartTypeIndex].dateKeys.length
   ) {
      if (dateKeys && dateKeys.length) {
         // TODO: finish this
         // const index = allowedCharts[chartTypeIndex].slices.findIndex(
         //    col => col.key === slice
         // )
         // if (index >= 0)
         //    chartData[0].push({
         //       ...allowedCharts[chartTypeIndex].slices[index],
         //       label: allowedCharts[chartTypeIndex].slices[index].key,
         //    })
      } else {
         chartData[0].push({
            type: 'date',
            key: allowedCharts[chartTypeIndex].dateKeys[0],
         })
      }
   }

   if (metrices.length) {
      metrices.forEach(column => {
         chartData[0].push({ ...column, type: 'number' })
      })
   } else {
      if (
         Array.isArray(allowedCharts) &&
         allowedCharts.length &&
         allowedCharts[chartTypeIndex] &&
         allowedCharts[chartTypeIndex].metrices?.length
      ) {
         chartData[0].push({
            ...allowedCharts[chartTypeIndex].metrices[0],
            type: 'number',
         })
      }
   }

   // add chart data
   transformedData.forEach(data => {
      const row = []

      chartData[0].forEach((label, i) => {
         if (i === 0) {
            row.push(new Date(data[label.key]))
         } else {
            row.push(data[label.key])
         }
      })

      chartData.push(row)
   })

   return chartData
}
