function ExpenseItem({ expense }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      background: "#f4f4f4",
      padding: "10px",
      marginTop: "8px",
      borderRadius: "8px"
    }}>
      <span>{expense.name}</span>
      <span>${expense.amount}</span>
      <span>{expense.category}</span>
    </div>
  );
}

export default ExpenseItem;