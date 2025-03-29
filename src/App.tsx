import { useEffect, useRef, useState } from "react";
import TextStream from "./components/TextStream";
import TextStreamFromGist from "./components/TextStreamFromGist";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function App() {
  const [textFromGist, setTextFromGist] = useState("");
  const textStreamRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [setLoginFormVisible, isLoginFormVisible] = useState(false);
  const [isSignUp, setSignUp] = useState(false);
  // get if test is still active
  // get performance info

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); //reset
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGistTextLoad = (text: string) => {
    setTextFromGist(text);
  };

  const handleTestComplete = async (results: {
    wpm: any;
    cpm: any;
    accuracy: any;
  }) => {
    if (user) {
      try {
        await addDoc(collection(db, "testResults"), {
          userId: user.uid,
          email: user.email,
          wpm: results.wpm,
          cpm: results.cpm,
          accuracy: results.accuracy,
          timestamp: new Date(),
        });
        console.log("Test results saved successfully!");
      } catch (err) {
        console.error("Error saving test results: ", err);
      }
    }
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
        backgroundColor: "#161413",
      }}
    >
      <p
        onClick={() => setLoginFormVisible(!isLoginFormVisible)}
        style={{ color: "white", cursor: "pointer" }}
      >
        {isSignUp ? "Sign Up" : "Login"}
      </p>
      <button
        onClick={() => setSignUp(!isSignUp)}
        style={{ marginBottom: "10px" }}
      >
        Switch to {isSignUp ? "Login" : "Sign Up"}
      </button>

      {user ? (
        <div style={{ color: "white" }}>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        isLoginFormVisible && (
          <form
            onSubmit={isSignUp ? handleSignUp : handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "200px",
              position: "relative",
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "10px", fontSize: "16px" }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "10px", fontSize: "16px" }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "10px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        )
      )}

      <div style={{ display: "grid", textAlign: "center", color: "white" }}>
        <h1>
          <i>
            <b>Typing Typer</b>
          </i>
        </h1>
        <p>Typing Test</p>
      </div>
      <TextStreamFromGist onLoadText={handleGistTextLoad} />
      {textFromGist && (
        <TextStream
          ref={textStreamRef}
          textToType={textFromGist}
          onTestComplete={handleTestComplete}
        />
      )}
    </div>
  );
}

export default App;
