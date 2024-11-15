import { useEffect, useRef, useState } from "react";
import TextStream from "./components/TextStream";
import TextStreamFromGist from "./components/TextStreamFromGist";

function App() {
  const [textFromGist, setTextFromGist] = useState("");
  const textStreamRef = useRef<HTMLInputElement | null>(null);

  const handleGistTextLoad = (text: string) => {
    setTextFromGist(text);
  };

  useEffect(() => {
    if (textFromGist && textStreamRef.current) {
      textStreamRef.current.focus();
    }
  }, [textFromGist]);

  return (
    <div
      style={{
        alignContent: "center",
        padding: "30px",
        fontFamily: "monospace",
        backgroundColor: "#31393c",
      }}
    >
      <div
        style={{
          display: "grid",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>
          <i>
            <b>Typing Typer</b>
          </i>
        </h1>
        <p>Typing Test</p>
      </div>
      <TextStreamFromGist onLoadText={handleGistTextLoad}></TextStreamFromGist>
      {textFromGist && (
        <TextStream ref={textStreamRef} textToType={textFromGist}></TextStream>
      )}
    </div>
  );
}

export default App;
