import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions"));
    if (saved) setTransactions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (text === "" || amount === "") return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: +amount,
    };

    setTransactions([...transactions, newTransaction]);
    setText("");
    setAmount("");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income + expense;

  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, Math.abs(expense)],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  return (
    <div className="container">
      <h2>Expense Tracker Dashboard</h2>

      <div className="summary">
        <div>
          <h4>Balance</h4>
          <p>₹ {balance}</p>
        </div>
        <div>
          <h4>Income</h4>
          <p className="income">₹ {income}</p>
        </div>
        <div>
          <h4>Expense</h4>
          <p className="expense">₹ {expense}</p>
        </div>
      </div>

      <div className="chart">
        <Pie data={chartData} />
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Enter description"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter amount (+income, -expense)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addTransaction}>Add Transaction</button>
      </div>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.text} 
            <span className={t.amount > 0 ? "income" : "expense"}>
              ₹ {t.amount}
            </span>
            <button onClick={() => deleteTransaction(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;