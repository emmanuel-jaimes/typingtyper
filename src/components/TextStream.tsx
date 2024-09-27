import React, { useRef, useState, useEffect } from "react";
import "./TextStreamFromGist";

interface Props {
  textToType: string; // The text to be typed by the user
}

const TextStream: React.FC<Props> = ({ textToType }) => {
  const [userInput, setUserInput] = useState("");
  const [wpm, setWpm] = useState<number | null>(null);
  const [cpm, setCpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestActive, setTestActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [correctCharacters, setCorrectCharacters] = useState<number>(0);
  const textRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTestActive) return; //input only when active
    const userInputValue = e.target.value;
    setUserInput(userInputValue);
    calculateAccuracy(userInputValue);
    scrollText(userInputValue.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault(); //prevent backspace
    }
    inputRef.current?.focus();
  };

  const handleTextClick = () => {
    if (!isTestActive) {
      startTest();
    }
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
    setCorrectCharacters(correctCharacters);

    if (userInputValue.length / textToType.length > 0.1) {
      if (textRef.current) {
        textRef.current.style.transform = "translateY(-50px)";
      }
    }
  };

  const calculateWpmAndCpm = () => {
    const totalCharactersTyped = userInput.length;
    const totalWordsTyped = correctCharacters / 5; // ~: 1 word = 5 characters

    const wpmResult = totalWordsTyped;
    const cpmResult = totalCharactersTyped;

    setWpm(wpmResult);
    setCpm(cpmResult);
  };

  const startTest = () => {
    setTestActive(true);
    setTimeLeft(60);
  };

  // Timer logic
  useEffect(() => {
    if (!isTestActive || timeLeft <= 0) return; // Stop timer when test is not active or reaches 0
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft]);

  // Stop the test when time ends
  useEffect(() => {
    if (timeLeft === 0) {
      setTestActive(false); // Disable input
      calculateWpmAndCpm();
    }
  }, [timeLeft]);

  const renderTextWithHighlight = () => {
    return (
      <div ref={textRef} className="text-container">
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

  const scrollText = (typedLength: number) => {
    if (textRef.current) {
      const totalLength = textToType.length;
      const progress = typedLength / totalLength;

      // Scroll every 10% of the text typed
      const scrollStep = Math.floor(progress * 10); // Integer value, changes every 10%
      const scrollPercentage = scrollStep / 10;
      const scrollAmount = scrollPercentage * textRef.current.scrollHeight;
      textRef.current.style.transform = `translateY(-${scrollAmount}px)`;
    }
  };

  return (
    <div className="input-container">
      <div
        className="text-to-type"
        onClick={handleTextClick}
        style={{
          backgroundColor: "white",
          padding: "2vh",
          borderRadius: "15px",
          borderWidth: "3px",
          borderColor: "#808080",
        }}
      >
        {renderTextWithHighlight()}
      </div>
      <input
        type="text"
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isTestActive || timeLeft <= 0}
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
      <div className="timer">Time Left: {timeLeft} seconds</div>
      {!isTestActive && timeLeft === 0 && (
        <div className="Results">
          <div>WPM: {wpm?.toFixed(2)}</div>
          <div>CPM: {cpm?.toFixed(2)}</div>
        </div>
      )}
      <style>{`

        html, body {
            height: 100%,
            padding: 0;
            margin: 0;
            background-color: #F5F5F5;
        }
        .input-container {
            max-height: 600px;
        }
        .text-container{
            font-size: 20px;
            letter-spacing: 1px;
            line-height: 1.5;
            // max-height: 500px;
            overflow-y: hidden;
            border-color: black;
            transition: transform 0.3s ease-in-out;
            white-space: prewrap;
        }

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
        .timer {
          margin-top: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        .results {
          margin-top: 20px;
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default TextStream;
