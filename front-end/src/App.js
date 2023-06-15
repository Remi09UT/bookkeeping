import Title from "./comps/Title";
import tranGenerator from "./fake_data/tranGenerator";

function App() {
  // fake transactions for testing only
  const transactions = tranGenerator();

  return (
    <div className="App">
      <Title transactions={transactions} />
    </div>
  );
}

export default App;
