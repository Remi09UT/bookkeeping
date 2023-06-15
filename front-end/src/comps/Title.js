import React from "react";

const Title = ({ transactions }) => {
  const month = new Date().toLocaleString("en-US", { month: "long" });
  let balance = 0;
  let income = 0;
  let expense = 0;
  transactions.forEach((transaction) => {
    balance += transaction.amount;
    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });
  const formattedBalance = balance.toFixed(2).toLocaleString();
  const formattedIncome = income.toFixed(2).toLocaleString();
  const formattedExpense = expense.toFixed(2).toLocaleString();

  return (
    <div className="title">
      <h1>{month}</h1>
      <h2>${formattedBalance}</h2>
      <div className="income-expense">
        <div>
          <h3>Income</h3>
          <p>{formattedIncome}</p>
        </div>
        <div>
          <h3>Expense</h3>
          <p>{formattedExpense}</p>
        </div>
      </div>
      <p>A penny saved is a penny earned.</p>
    </div>
  );
};

export default Title;
