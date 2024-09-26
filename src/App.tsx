import { useState } from "react";
import TextStream from "./components/TextStream";
import TextStreamFromGist from "./components/TextStreamFromGist";

function App() {
  const [textFromGist, setTextFromGist] = useState("");

  const handleGistTextLoad = (text: string) => {
    setTextFromGist(text);
  };

  return (
    <div
      style={{
        alignContent: "center",
        padding: "50px",
        backgroundColor: "lightgray",
      }}
    >
      <div
        style={{
          display: "grid",
          textAlign: "center",
        }}
      >
        <h1>Typing Typer</h1>
        <p>Typing Test</p>
      </div>
      <TextStreamFromGist onLoadText={handleGistTextLoad}></TextStreamFromGist>
      {textFromGist && <TextStream textToType={textFromGist}></TextStream>}
    </div>
  );
}

export default App;
