import { useState } from "react";

function getIcon(category) {
  switch (category) {
    case "Food":
      return "🍔";
    case "Transportation":
      return "🚗";
    case "Shopping":
      return "🛍️";
    case "Bills":
      return "💡";
    case "Entertainment":
      return "🎮";
    default:
      return "📦";
  }
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return "Yesterday";
}

function ExpenseItem({ expense, deleteExpense, updateExpense }) {
  const [isEditing, setIsEditing] = useState(false);

  const [newName, setNewName] = useState(expense.name);
  const [newAmount, setNewAmount] = useState(expense.amount);
  const [newCategory, setNewCategory] = useState(expense.category);

  const handleSave = () => {
    updateExpense(expense.id, {
      ...expense,
      name: newName,
      amount: Number(newAmount),
      category: newCategory
    });

    setIsEditing(false);
  };

  return (
    <div className="expense-item">

      {isEditing ? (
        // 🔥 EDIT MODE
        <>
          <div className="expense-left">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
          </div>

          <div className="expense-right">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        // 🔥 NORMAL VIEW
        <>
          <div className="expense-left">
            <div className="name-row">
              <span className="icon">{getIcon(expense.category)}</span>
              <strong>{expense.name}</strong>
            </div>

            <small className="timestamp">
              {getTimeAgo(expense.date)}
            </small>
          </div>

          <div className="expense-right">
            <span className="amount">
              ${expense.amount.toFixed(2)}
            </span>

            <span className="category">
              {expense.category}
            </span>

            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteExpense(expense.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default ExpenseItem;
