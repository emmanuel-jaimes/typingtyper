import React, { useRef, useState } from "react";
import "./TextStreamFromGist";

interface Props {
  textToType: string; // The text to be typed by the user
}

const TextStream: React.FC<Props> = ({ textToType }) => {
  const [userInput, setUserInput] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(10);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInputValue = e.target.value;
    setUserInput(userInputValue);
    calculateAccuracy(userInputValue);
    calculateWpm(userInputValue);
    calculateCpm(userInputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault(); //prevent backspace
    }
  };

  const handleTextClick = () => {
    inputRef.current?.focus();
  };

  const calculateAccuracy = (userInputValue: string) => {
    let correctCharacters = 0;
    for (let i = 0; i < userInputValue.length; i++) {
      if (userInputValue[i] === textToType[i]) {
        correctCharacters++;
      }
    }
    const accuracyPercentage =
      (correctCharacters / userInputValue.length) * 100;
    setAccuracy(isNaN(accuracyPercentage) ? 100 : accuracyPercentage);
  };

  //calculate words per minute
  const calculateWpm = (userInputValue: string) => {
    const timeElapsed = new Date().getTime() - new Date(textToType).getTime();
    const timeInMinutes = timeElapsed / 60000;
    const wordsTyped = userInputValue.split(" ").length;
    const wpm = wordsTyped / timeInMinutes;
    setWpm(isNaN(wpm) ? 0 : wpm);
  };

  //calculate characters per minute
  const calculateCpm = (userInputValue: string) => {
    const timeElapsed = new Date().getTime() - new Date(textToType).getTime();
    const timeInMinutes = timeElapsed / 60000;
    const charactersTyped = userInputValue.length;
    const cpm = charactersTyped / timeInMinutes;
    setCpm(isNaN(cpm) ? 0 : cpm);
  };

  const renderTextWithHighlight = () => {
    return (
      <div>
        {textToType.split("").map((char, index) => {
          let charClass = "";
          if (index < userInput.length) {
            charClass =
              userInput[index] === textToType[index] ? "correct" : "incorrect";
          }
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="input-container">
      <div className="text-to-type" onClick={handleTextClick}>
        {renderTextWithHighlight()}
      </div>
      <input
        type="text"
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          textAlign: "left",
          padding: "10px 20px",
          caretColor: "transparent",
          width: "0%",
          opacity: "0",
        }}
        autoFocus
      />
      <span className="accuracy">Accuracy: {accuracy.toFixed(2)}%</span>
      <span className="wpm">WPM: {wpm.toFixed(2)}</span>
      <span className="cpm">CPM: {cpm.toFixed(2)}</span>

      <style>{`
        .correct {
          background-color: #90EE90;
        }
        .incorrect {
          background-color: #FFCCCB;
        }
        .accuracy {
          margin-top: 10px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default TextStream;
