import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div>
        <h1>Hello World</h1>
      </div>
      <table>
          <ul>
            <li>asdfasd</li>
            <li>asdfasd</li>
            <li>asdfasd</li>
            <li>asdfasd</li>
            <li>asdfasd</li>
          </ul>
      </table>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is fasidjasd {count}</button>
        <table>
          <ul>
            <li>김용우</li>
            <li>박찬호</li>
            <li>현진섭</li>
            <li>이원서</li>
            <li>최예지</li>
            <li>오지원</li>
          </ul>
        </table>
        <h3>안녕하세요</h3>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
