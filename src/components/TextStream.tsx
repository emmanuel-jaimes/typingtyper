import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./TextStreamFromGist";
import Button from "./Button";
import Alert from "./Alert";

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
    const [charactersPerLine, setCharactersPerLine] = useState(115);
    const [isTestStarted, setTestStarted] = useState<boolean>(false);
    const [isTestActive, setTestActive] = useState<boolean>(false);
    const [correctCharacters, setCorrectCharacters] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    // useImperativeHandle(ref, () => ({
    //   focus() {
    //     inputRef.current?.focus();
    //   },
    //   startTest() {
    //     if (!isTestActive) {
    //       setTestActive(true);
    //     }
    //   },
    // }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const userInputValue = e.target.value;

      if (!isTestStarted && isTestActive) {
        startTest();
      }
      if (!isTestActive) {
        setTestActive(true);
      }

      setUserInput(userInputValue);
      calculateAccuracy(userInputValue);
      scrollText(userInputValue.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault(); // prevent backspace
      }
      if (isTestActive && !isTestStarted) {
        startTest();
      }
      inputRef.current?.focus();
    };

    const handleTextClick = () => {
      if (!isTestActive) {
        setTestActive(true);
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
      setTimeLeft(60);
      inputRef.current?.focus();
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
        <div ref={textRef} className="stream-container">
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
        // Move the text up by one line when enough characters have been typed to complete a line
        const scrollAmount = typedLength * 16.65; // Adjust based on line-height
        textRef.current.style.transform = `translateX(-${scrollAmount}px)`;
      }
    };

    return (
      <div className="input-container">
        <div className="results-container">
          <Button
            children={"Time left"}
            value={timeLeft}
            color="warning"
          ></Button>
          <Button children="Accuracy" value={accuracy.toFixed(0)}></Button>

          {!isTestActive && timeLeft === 0 && (
            <div className="Results">
              <Button
                children={"WPM"}
                value={wpm?.toFixed(0)}
                color="success"
              ></Button>
              <Button
                children={"CPM"}
                value={cpm?.toFixed(0)}
                color="success"
              ></Button>
            </div>
          )}
        </div>
        <div
          className="text-to-type"
          onClick={handleTextClick}
          style={{
            backgroundColor: isTestActive ? "white" : "transparent",
            padding: "2vh",
            marginTop: "30px",
            borderRadius: "15px",
            borderWidth: "3px",
            overflow: "hidden",
            maxHeight: "15em",
            justifyContent: "start",
            fontFamily: "monospace",
            fontSize: "xx-large",
            letterSpacing: "1px",
          }}
        >
          {renderTextWithHighlight()}
        </div>
        <input
          className="stream-container"
          type="text"
          ref={inputRef}
          value={userInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!isTestActive || timeLeft <= 0}
          style={{
            textAlign: "center",
            padding: "10px 50%",
            caretColor: "black",
            width: "0%",
            opacity: "100",
            textWrap: "nowrap",
            whiteSpace: "nowrap",
            backgroundColor: "transparent",
            position: "fixed",
            left: "-10000px",
          }}
          autoFocus
        />

        <style>{`
        html, body {
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: #F5F5F5;
        }
        .results-container {
          padding-top: 120px;
          justify-content: center;
          display: flex;
        }
        .input-container {
            max-height: 10px;
            border: black;
            justify-content: center;
            align-items: center;
        }
        .stream-container{
            text-align: center;
            padding: 10px 50%;
            width: 0%;
            caret-color: black;
            white-space: nowrap;
            background-color: transparent;
            border: none;
        }
        .text-to-type {
            display: flex;
            justify-content: center;
            align-items: center;
            text-wrap: nowrap;
            height: 5em;
        }
        .text-container {
            font-size: 20px;
            letter-spacing: 1px;
            line-height: 2.5;
            transition: transform 0.3s ease-in-out;
            white-space: nowrap;
            overflow: hidden; 
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
