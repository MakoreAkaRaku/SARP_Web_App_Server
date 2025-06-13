import Chart from "chart.js/auto"
// main.js
(async function() {
  const data = [
    { year: new Date('2010-01-01'), count: 10 },
    { year: new Date('2011-01-01'), count: 20 },
    { year: new Date('2012-01-01'), count: 15 },
    { year: new Date('2013-01-01'), count: 25 },
    { year: new Date('2014-01-01'), count: 22 },
    { year: new Date('2015-01-01'), count: 30 },
    { year: new Date('2016-01-01'), count: 28 },
  ];
import Chart from 'chart.js/auto';

let chart: Chart;

// ✅ Initialize empty chart
function initChart() {
  const ctx = document.getElementById('linechart') as HTMLCanvasElement;
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature (Cº)',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Dynamic Yearly Temperature'
        }
      }
    }
  });
}

// ✅ Load data dynamically and update chart
async function loadChartData(range: string) {
  const res = await fetch(`/data?range=${range}`);
  const data = await res.json();

  chart.data.labels = data.map((d: any) => d.year);
  chart.data.datasets[0].data = data.map((d: any) => d.count);
  chart.update();
}

// ✅ Hook to user input
function setupUI() {
  const select = document.getElementById('range') as HTMLSelectElement;
  const button = document.getElementById('load') as HTMLButtonElement;

  button.addEventListener('click', () => {
    const selectedRange = select.value;
    loadChartData(selectedRange);
  });
}

// ✅ Run all setup
initChart();
setupUI();
