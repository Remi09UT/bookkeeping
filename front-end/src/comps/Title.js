import Grid from "@mui/material/Grid";

const Title = ({ transactions }) => {
  const month = new Date().toLocaleString("en-US", { month: "long" });
  let balance = 0;
  const formattedBalance = balance.toFixed(2).toLocaleString();

  return (
    <>
      <div className="title">
        <h1>{month}</h1>
        <h2>${formattedBalance}</h2>
        <p>A penny saved is a penny earned.</p>
      </div>
    </>
  );
};

export default Title;
