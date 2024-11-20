import { useEffect, useRef, useState } from "react";
import TextStream from "./components/TextStream";
import TextStreamFromGist from "./components/TextStreamFromGist";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function App() {
  const [textFromGist, setTextFromGist] = useState("");
  const textStreamRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

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
      <p style={{ color: "white" }}>Login</p>

      {user ? (
        <div style={{ color: "white" }}>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form
          onSubmit={handleLogin}
          style={{
            display: "grid",
            gap: "10px",
            width: "100px",
            right: "10",
            position: "absolute",
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
            Login
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}

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
