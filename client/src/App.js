import { useEffect, useState } from "react";

const baseUrl = "https://react-express-session-auth.herokuapp.com";
// const baseUrl = "http://localhost:3001";

function App() {
  const [username, setUsername] = useState("yakhousam");
  const [password, setPassword] = useState("123456");

  const [isLogin, setIslogin] = useState(false);
  const [error, setError] = useState("");

  const [greeting, setGreeting] = useState("");

  const [isFetching, setIsFetching] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIslogin("");
    setGreeting("");
    fetch(`${baseUrl}/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.status < 300) {
          return res.json();
        }
        throw new Error("login failed");
      })
      .then((data) => setIslogin(true))
      .catch((e) => setError(e.message));
  };
  const handleGreeting = () => {
    fetch(`${baseUrl}/greeting`, { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => setGreeting(data.message))
      .catch(console.error);
  };
  const handleLogout = () => {
    fetch(`${baseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => setIslogin(false))
      .catch(console.error);
  };
  useEffect(() => {
    fetch(`${baseUrl}/islogedin`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setIslogin(true);
        }
      })
      .catch((e) => {
        console.error(e);
        setError("something went wrong");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);
  if (isFetching) {
    return <p>Loading....</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 50,
      }}
    >
      {!isLogin && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: ".5rem" }}
          />
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: ".5rem" }}
          />
          <button type="submit">Login</button>
        </form>
      )}
      <div>
        {error}
        {isLogin && (
          <div>
            <span>logged in</span>
            <button onClick={handleLogout}>logout</button>
          </div>
        )}
      </div>
      {isLogin && (
        <div style={{ marginTop: ".5rem" }}>
          <button onClick={handleGreeting}>Greetting</button>
          <p style={{ marginTop: ".5rem" }}>{greeting}</p>
        </div>
      )}
    </div>
  );
}

export default App;
