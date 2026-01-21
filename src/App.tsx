import React from "react";

function App(): React.ReactElement {
  const [count, setCount] = React.useState<number>(0);

  return (
    <div style={styles.container}>
      <h1>React + Vite + TypeScript</h1>
      <p>カウンター: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)} style={styles.button}>
        カウントアップ
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    marginTop: "20px",
  },
};

export default App;
