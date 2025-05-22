import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PortfolioChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <i className="fas fa-chart-line"></i>
        <p>No chart data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(point => new Date(point.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Portfolio Value',
        data: data.map(point => point.value),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="portfolio-chart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <style jsx>{`
        .portfolio-chart {
          height: 200px;
          margin-top: 1rem;
        }

        .chart-container {
          height: 100%;
          position: relative;
        }

        .chart-placeholder {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .chart-placeholder i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }

        .chart-placeholder p {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default PortfolioChart;
