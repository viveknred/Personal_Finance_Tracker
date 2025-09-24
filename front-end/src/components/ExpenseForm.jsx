import { useState } from "react";
import PropTypes from "prop-types";
import { PlusCircle, DollarSign, Calendar, FileText, Loader2 } from "lucide-react";

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }
    
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newExpense = { 
        description: description.trim(), 
        amount: parseFloat(amount), 
        date 
      };
      await onAddExpense(newExpense);
      
      // Reset form
      setDescription("");
      setAmount("");
      setDate("");
      setErrors({});
      
      // Show success feedback (optional)
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Expense added successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (error) {
      console.error("Failed to add expense:", error);
      setErrors({ submit: "Failed to add expense. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <PlusCircle className="w-6 h-6 mr-2 text-blue-500" />
        Add New Expense
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-slate-500" />
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense description..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.description 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-slate-300 focus:ring-blue-500 hover:border-slate-400'
            }`}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-slate-500" />
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.amount 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-slate-300 focus:ring-blue-500 hover:border-slate-400'
            }`}
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
              errors.date 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-slate-300 focus:ring-blue-500 hover:border-slate-400'
            }`}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding Expense...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

ExpenseForm.propTypes = {
  onAddExpense: PropTypes.func.isRequired,
};

export default ExpenseForm;
