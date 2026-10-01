import { useState, useEffect } from "react";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [income, setIncome] = useState(780);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("none");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses([
      ...expenses,
      { ...expense, month: selectedMonth }
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const clearExpenses = () => {
    if (window.confirm("Delete all expenses?")) {
      setExpenses([]);
    }
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? updatedExpense : e
      )
    );
  };

  const exportToCSV = () => {
    const headers = ["Name", "Amount", "Category", "Date"];

    const rows = expenses.map((e) => [
      e.name,
      e.amount,
      e.category,
      new Date(e.date).toLocaleString()
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredExpenses =
    filter === "All"
      ? expenses.filter((e) => e.month === selectedMonth)
      : expenses.filter(
          (e) =>
            e.category === filter && e.month === selectedMonth
        );

  let sortedExpenses = [...filteredExpenses];

  if (sort === "high") {
    sortedExpenses.sort((a, b) => b.amount - a.amount);
  } else if (sort === "low") {
    sortedExpenses.sort((a, b) => a.amount - b.amount);
  }

  const totalAmount = sortedExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // 🔥 NEW FEATURE
  const remaining = income - totalAmount;

  const isOverBudget = totalAmount > income;

  const categoryTotals = sortedExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  const totalSpent = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );
  
  const categoryData = Object.entries(categoryTotals)
  .map(([category, amount]) => ({
    name: '${category} (${((amount / totalSpent) * 100).toFixed(1)}%)',
    amount
  }))
  .sort((a, b) => b.amount - a.amount);


  const COLORS = ["#4c6ef5", "#05130b", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Easy Spend</h1>

      {/* TOP BUTTONS */}
      <div className="top-buttons">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

        <button onClick={exportToCSV}>
          Export CSV 
        </button>
      </div>

      {/* MONTH + INCOME */}
      <div className="top-controls">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <input
          type="number"
          placeholder="Set Monthly Income"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
        />
      </div>

      {/* STATS */}
      <div className="stats-card">
        <p className="stats-title">
          Total Spent: <span>${totalAmount.toFixed(2)}</span>
        </p>

        <div className="stats-row">
          <span className="income">
            Income: +${income.toFixed(2)}
          </span>

          <span className="expenses">
            Expenses: -${totalAmount.toFixed(2)}
          </span>

          <span className={remaining >= 0 ? "remaining" : "over"}>
            Remaining: ${remaining.toFixed(2)}
          </span>
        </div>

        {isOverBudget && (
          <p className="warning">
            You are over your monthly budget!
          </p>
        )}

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                income > 0
                  ? Math.min((totalAmount / income) * 100, 100)
                  : 0
              }%`,
              background: isOverBudget
                ? "#ef4444"
                : "linear-gradient(to right, #4c6ef5, #22c55e)"
            }}
          ></div>
        </div>
      </div>

      {/* CHART */}
      {categoryData.length > 0 && (
        <div className="chart-container">
          <h3>Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
              data={categoryData}
               dataKey="amount" 
               nameKey="name" 
               outerRadius={80}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                  }
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FILTER */}
      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">Filter by Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort by</option>
          <option value="high">Price High → Low</option>
          <option value="low">Price Low → High</option>
        </select>

        <button onClick={() => setFilter("All")}>
          Clear Filter
        </button>
      </div>

      <ExpenseForm addExpense={addExpense} />

      <ExpenseList
        expenses={sortedExpenses}
        deleteExpense={deleteExpense}
        clearExpenses={clearExpenses}
        updateExpense={updateExpense}
      />
    </div>
  );
}

export default App;
