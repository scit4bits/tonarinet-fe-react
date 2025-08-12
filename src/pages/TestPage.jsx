import { useEffect, useState } from "react";
import TestComponent from "../components/TestComponent";
import axios from "axios";

function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [postResult, setPostResult] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const data = await axios.get("https://tnsv.thxx.xyz/api/simple/hello");

      console.log(data.data);
      setData(data.data);
    }

    fetchData();
  }, []);

  async function onClickHandlerOK() {
    const payload = {
      message: input,
    };
    const result = await axios.post(
      "https://tnsv.thxx.xyz/api/simple/echo",
      payload
    );

    setPostResult(result.data);
    console.log(result);
  }

  async function onClickHandlerError() {
    try {
      const payload = {};
      const result = await axios.post(
        "https://tnsv.thxx.xyz/api/simple/echo",
        payload
      );
      console.log(result);
    } catch (e) {
      setError(e.response.data.reply);
      console.error(e);
    }
  }

  function onInputHandler(event) {
    setInput(event.target.value);
  }

  if (!data) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1>{error}</h1>
      </>
    );
  }

  return (
    <>
      <div>
        <TestComponent message={"HELLO"} number={123} />
        <p>{data.reply}</p>

        <input type="text" name="lel" onInput={onInputHandler} />
        <button onClick={onClickHandlerError}>GO AJAX ERROR</button>
        <button onClick={onClickHandlerOK}>GO AJAX OK</button>
        {postResult && <p>{postResult.reply}</p>}
      </div>
    </>
  );
}

export default TestPage;
