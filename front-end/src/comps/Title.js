import Grid from "@mui/material/Grid";

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
    <>
      <div className="title">
        <h1>{month}</h1>
        <h2>${formattedBalance}</h2>
        <p>A penny saved is a penny earned.</p>
      </div>

      <div className="title2">
        <div className="Grid">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <h3>${formattedIncome}</h3>
              <p>Income</p>
            </Grid>
            <Grid item xs={6}>
              <h3>${formattedExpense}</h3>
              <p>Expense</p>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Title;
