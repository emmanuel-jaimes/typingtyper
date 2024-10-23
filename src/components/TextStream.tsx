import React, { useRef, useState, useEffect, forwardRef } from "react";
import "./TextStreamFromGist";

interface Props {
  textToType: string; // The text to be typed by the user
}

const TextStream = forwardRef<HTMLInputElement, Props>(
  ({ textToType }, ref) => {
    const [userInput, setUserInput] = useState("");
    const [wpm, setWpm] = useState<number | null>(null);
    const [cpm, setCpm] = useState<number | null>(null);
    const [accuracy, setAccuracy] = useState(100);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTestStarted, setTestStarted] = useState<boolean>(false);
    const [isTestActive, setTestActive] = useState<boolean>(false);
    const [correctCharacters, setCorrectCharacters] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const charactersPerLine = 115;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const userInputValue = e.target.value;

      if (isTestActive) {
        setUserInput(userInputValue);
        calculateAccuracy(userInputValue);
        scrollText(userInputValue.length);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault(); // prevent backspace
      }
      inputRef.current?.focus();
    };

    const handleTextClick = () => {
      if (!isTestStarted) {
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
      setTestStarted(true);
      setTestActive(true);
      setTimeLeft(60);
    };

    // Timer logic
    useEffect(() => {
      if (!isTestStarted || timeLeft <= 0) return; // Stop timer when test is not active or reaches 0
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }, [isTestStarted, timeLeft]);

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
                userInput[index] === textToType[index]
                  ? "correct"
                  : "incorrect";
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
        // Calculate how many lines have been typed
        const linesTyped = Math.floor(typedLength / charactersPerLine);

        // Move the text up by one line when enough characters have been typed to complete a line
        const scrollAmount = linesTyped * 2.5; // Adjust based on line-height
        textRef.current.style.transform = `translateY(-${scrollAmount}em)`;
      }
    };

    return (
      <div className="input-container">
        <div
          className="text-to-type"
          onClick={handleTextClick}
          style={{
            backgroundColor: isTestActive ? "white" : "transparent",
            padding: "2vh",
            borderRadius: "15px",
            borderWidth: "3px",
            borderColor: "#808080",
            overflow: "hidden",
            maxHeight: "15em",
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
            textAlign: "center",
            padding: "10px 20px",
            caretColor: "black",
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
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: #F5F5F5;
        }
        .input-container {
            max-height: 600px;
        }
        .text-container {
            font-size: 20px;
            letter-spacing: 1px;
            line-height: 2.5;
            transition: transform 0.3s ease-in-out;
            white-space: pre-wrap;
            overflow: hidden; /* Hide the text that is scrolled out of view */
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
  }
);

export default TextStream;
