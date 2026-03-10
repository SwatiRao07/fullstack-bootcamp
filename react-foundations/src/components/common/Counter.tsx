import React, { useState } from "react";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-component">
      <p>
        Reading Goal: <strong>{count}</strong> books
      </p>
      <div className="counter-controls">
        <button onClick={() => setCount((prev) => Math.max(0, prev - 1))}>
          -
        </button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
        <button className="reset-btn" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </div>
  );
};
