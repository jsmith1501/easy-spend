import { useState } from "react";

function ExpenseForm({ addExpense }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !amount) return;

        addExpense ({
            id: Date.now(),
            name, amount: parseFloat(amount),
            category,
        });

        setName("");
        setAmount("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Expense name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input 
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setCategory(e.target.value)}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}   
            >
                <option>Food</option>
                <option>Rent</option>
                <option>Entertainment</option>
                <option>Transportation</option>
                <option>Other</option>
            </select>

            <button type="submit">Add Expense</button>
        </form>
    );
}

export default ExpenseForm;