import PropTypes from "prop-types";
import { Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ExpenseChart({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">No data to display</p>
        <p className="text-sm text-slate-400 mt-1">Add some expenses to see trends</p>
      </div>
    );
  }

  // Sort expenses by date
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare line chart data
  const lineChartData = {
    labels: sortedExpenses.map(expense => 
      new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: "Daily Expenses",
        data: sortedExpenses.map(expense => expense.amount),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Prepare doughnut chart data (categorize by first word of description)
  const categories = {};
  expenses.forEach(expense => {
    const category = expense.description.split(' ')[0].toLowerCase();
    categories[category] = (categories[category] || 0) + expense.amount;
  });

  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const doughnutData = {
    labels: Object.keys(categories).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: categoryColors.slice(0, Object.keys(categories).length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const expense = sortedExpenses[context[0].dataIndex];
            return new Date(expense.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: function(context) {
            const expense = sortedExpenses[context.dataIndex];
            return `₹${expense.amount.toFixed(2)} - ${expense.description}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F1F5F9',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 12,
          },
          callback: function(value) {
            return '₹' + value;
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          color: '#64748B',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `₹${context.parsed.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="space-y-8">
      {/* Line Chart */}
      <div>
        <div className="flex items-center mb-4">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
          <h4 className="text-sm font-medium text-slate-700">Expense Timeline</h4>
        </div>
        <div className="h-48 w-full">
          <Line data={lineChartData} options={lineOptions} />
        </div>
      </div>

      {/* Doughnut Chart */}
      {Object.keys(categories).length > 1 && (
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
            <h4 className="text-sm font-medium text-slate-700">Category Breakdown</h4>
          </div>
          <div className="h-48 w-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Total Amount:</span>
          <span className="font-semibold text-slate-800">
            ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Average per expense:</span>
          <span className="font-semibold text-slate-800">
            ₹{(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Highest expense:</span>
          <span className="font-semibold text-slate-800">
            ₹{Math.max(...expenses.map(exp => exp.amount)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// PropTypes validation
ExpenseChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ExpenseChart;
