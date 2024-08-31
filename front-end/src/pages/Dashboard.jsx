/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getExpenses, addExpense } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

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

  return (
    <div className="dashboard">
      <div className="main-content">
        <header>
          <h1 className="text-2xl font-bold text-gray-800 ">
            Personal Finance Tracker
          </h1>
        </header>
        <ExpenseForm onAddExpense={handleAddExpense} />
        <div className="my-4">
          <h2>Filter</h2>
          <label className="block mb-2">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-2">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <button
            onClick={handleFilter}
            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <ExpenseList
          expenses={filteredExpenses}
          onExpenseUpdated={fetchExpenses}
          onExpenseDeleted={fetchExpenses}
        />
      </div>
      <div className="chart-container">
        <ExpenseChart expenses={filteredExpenses} />
      </div>
    </div>
  );
}

export default Dashboard;
