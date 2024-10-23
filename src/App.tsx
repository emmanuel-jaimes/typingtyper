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
        padding: "50px",
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
      {textFromGist && (
        <TextStream ref={textStreamRef} textToType={textFromGist}></TextStream>
      )}
    </div>
  );
}

export default App;
