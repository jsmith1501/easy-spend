import ExpenseItem from "./ExpenseItem";

function ExpenseList({
  expenses,
  deleteExpense,
  clearExpenses,
  updateExpense   // ✅ ADD THIS
}) {

  return (
    <div>

      {/* HEADER */}
      <div className="list-header">
        <h3>Expense List</h3>

        {expenses.length > 0 && (
          <button className="clear-btn" onClick={clearExpenses}>
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {expenses.length === 0 ? (
        <p className="empty-msg">No expenses added yet.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            deleteExpense={deleteExpense}
            updateExpense={updateExpense}  // ✅ ADD THIS
          />
        ))
      )}

    </div>
  );
}

export default ExpenseList;
