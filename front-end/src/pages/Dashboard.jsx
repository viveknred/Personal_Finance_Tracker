/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getExpenses, addExpense } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import { Calendar, Filter, TrendingUp, DollarSign, CreditCard, PieChart } from "lucide-react";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Function to get the current month expenses
  const getCurrentMonthExpenses = (expenses) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
  };

  // Fetch expenses from the API and handle them
  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(startDate, endDate);
      if (data.length === 0) {
        setError("No data available.");
      } else {
        setError(null);
      }
      const sortedExpenses = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setExpenses(sortedExpenses);

      // Default to showing current month's expenses if no filter is applied
      if (!startDate && !endDate) {
        setFilteredExpenses(getCurrentMonthExpenses(sortedExpenses));
      } else {
        const filtered = sortedExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            (!startDate || new Date(expense.date) >= new Date(startDate)) &&
            (!endDate || new Date(expense.date) <= new Date(endDate))
          );
        });
        setFilteredExpenses(filtered);
      }
    } catch (error) {
      setError("Failed to fetch expenses.");
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [startDate, endDate]);

  const handleAddExpense = async (expense) => {
    try {
      const newExpense = await addExpense(expense);
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);

      // Update filtered expenses
      if (!startDate && !endDate) {
        setFilteredExpenses(getCurrentMonthExpenses(updatedExpenses));
      } else {
        setFilteredExpenses(
          updatedExpenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
              (!startDate || new Date(expense.date) >= new Date(startDate)) &&
              (!endDate || new Date(expense.date) <= new Date(endDate))
            );
          })
        );
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleFilter = () => {
    fetchExpenses();
  };

  // Calculate statistics
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Personal Finance Tracker
              </h1>
              <p className="text-slate-600 mt-2">Track your expenses and manage your budget efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold">₹{monthlyTotal.toFixed(2)}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Average Expense</p>
              <p className="text-3xl font-bold">₹{averageExpense.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      {isFilterVisible && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-500" />
            Filter Expenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleFilter}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Apply Filter
              </button>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  fetchExpenses();
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Form and List */}
        <div className="xl:col-span-2 space-y-8">
          {/* Add Expense Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center text-red-700">
                <div className="text-sm font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Expense List */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <ExpenseList
              expenses={filteredExpenses}
              onExpenseUpdated={fetchExpenses}
              onExpenseDeleted={fetchExpenses}
            />
          </div>
        </div>

        {/* Right Column - Chart */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 sticky top-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-500" />
              Expense Trends
            </h3>
            <ExpenseChart expenses={filteredExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
