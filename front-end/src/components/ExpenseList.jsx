import PropTypes from "prop-types";
import { useState } from "react";
import { Edit2, Trash2, Calendar, DollarSign, FileText, Package } from "lucide-react";

function ExpenseList({ expenses, onExpenseUpdated, onExpenseDeleted }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditStart = (expense) => {
    setEditingExpense(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
    });
  };

  const handleEditSave = async () => {
    if (editForm.description && editForm.amount && editForm.date) {
      await onExpenseUpdated(editingExpense, {
        ...editForm,
        amount: parseFloat(editForm.amount),
      });
      setEditingExpense(null);
      setEditForm({});
    }
  };

  const handleEditCancel = () => {
    setEditingExpense(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      onExpenseDeleted(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (description) => {
    const categories = {
      food: 'bg-orange-100 text-orange-800 border-orange-200',
      transport: 'bg-blue-100 text-blue-800 border-blue-200',
      entertainment: 'bg-purple-100 text-purple-800 border-purple-200',
      shopping: 'bg-pink-100 text-pink-800 border-pink-200',
      health: 'bg-green-100 text-green-800 border-green-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const desc = description.toLowerCase();
    for (const [category, className] of Object.entries(categories)) {
      if (desc.includes(category)) {
        return className;
      }
    }
    return categories.default;
  };

  if (expenses.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-500" />
          Recent Expenses
        </h3>
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h4 className="text-lg font-medium text-slate-600 mb-2">No expenses yet</h4>
          <p className="text-slate-500">Start by adding your first expense above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
        <Package className="w-5 h-5 mr-2 text-blue-500" />
        Recent Expenses ({expenses.length})
      </h3>
      
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-slate-300"
          >
            {editingExpense === expense.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleEditCancel}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-800 text-lg mb-1">
                        {expense.description}
                      </h4>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.description)}`}>
                        {expense.description.split(' ')[0]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">
                        ₹{expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        ID: #{expense.id}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditStart(expense)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {expenses.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Total Expenses Shown:</span>
            <span className="font-semibold">
              ₹{expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

ExpenseList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onExpenseUpdated: PropTypes.func.isRequired,
  onExpenseDeleted: PropTypes.func.isRequired,
};

export default ExpenseList;
