import { useState } from "react";

function ExpenseForm({ addExpense }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDATION
    if (!name && !amount) {
      setError("Please enter expense name and amount.");
      return;
    }

    if (!name) {
      setError("Please enter expense name.");
      return;
    }

    if (!amount) {
      setError("Please enter amount.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a valid number.");
      return;
    }

    // CLEAR ERROR
    setError("");

    // CREATE EXPENSE
    const newExpense = {
      id: Date.now(),
      name,
      amount: Number(amount),
      category,
      date: new Date()
    };

    addExpense(newExpense);

    // SUCCESS MESSAGE
    setSuccess("Expense added successfully!");
    setTimeout(() => setSuccess(""), 2000);

    // RESET FORM
    setName("");
    setAmount("");
    setCategory("Food");
  };

  return (
    <form onSubmit={handleSubmit}>

      {error && <p className="error">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <input
        type="text"
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
