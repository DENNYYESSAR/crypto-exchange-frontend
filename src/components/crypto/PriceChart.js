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

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <i className="fas fa-chart-line"></i>
        <p>No price data available</p>
      </div>
    );
  }

  const prices = data.map(point => point.price || point[1]);
  const timestamps = data.map(point => point.timestamp || point[0]);
  
  // Determine if overall trend is positive or negative
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isPositiveTrend = lastPrice >= firstPrice;

  const chartData = {
    labels: timestamps.map(timestamp => 
      new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: timestamps.length > 30 ? undefined : '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: isPositiveTrend ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        backgroundColor: isPositiveTrend 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: isPositiveTrend ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
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
          title: function(context) {
            const timestamp = timestamps[context[0].dataIndex];
            return new Date(timestamp).toLocaleString();
          },
          label: function(context) {
            return `$${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 6,
          color: 'rgb(107, 114, 128)',
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
          callback: function(value) {
            return '$' + value.toLocaleString(undefined, {
              minimumFractionDigits: value < 1 ? 4 : 2,
              maximumFractionDigits: value < 1 ? 8 : 2
            });
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="price-chart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>

      <style jsx>{`
        .price-chart {
          height: 100%;
          position: relative;
        }

        .chart-container {
          height: 100%;
          position: relative;
        }

        .chart-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background-color: var(--bg-light);
          border-radius: 8px;
        }

        .chart-placeholder i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .chart-placeholder p {
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default PriceChart;
