/**
 * Data object must be Object<{
 * chartName: string, 
 * label: Array<string>, 
 * value: Array<unknown>}>
 * @param {*} param0 
 * @returns built chart
 */
function createLineChart({
  element,
  dataset
}) {
  new Date().getTime()
  const dataConf = {
    labels: dataset.labels,
    datasets: [{
      label: dataset.chartName,
      data: dataset.values,
      fill: false,
      backgroundColor: 'rgb(220, 183, 16)',
      borderColor: 'rgb(17, 141, 17)',
      tension: 0.1
    }]
  };

  const config = {
    type: 'line',
    data: dataConf,
    options: {
      responsive: true,
      mantainAspectRatio: false,
    }
  };

  return new Chart(element, config)
}