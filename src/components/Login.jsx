import { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
export default function Login({ isLoggedIn, setLogin }) {
  const [userNameValue, setUserName] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setError] = useState(null);
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = "#080710";
    return () => {
      document.body.style.backgroundColor = ""; // Reset to default when unmounted
    };
  }, []);

  function handleUserName(event) {
    setUserName(event.target.value); // Use event.target.value to get input value
  }

  function handlePassword(event) {
    setPassword(event.target.value); // Use event.target.value to get input value
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userNameValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, parse the JSON to get the error message
          return response.json().then((errorData) => {
            // Throw an error with the message from the response
            throw new Error(errorData.message || "Unknown error");
          });
        }
        return response.json();
      })
      .then((data) => {
        setResult(data);
        setLogin(data.userId, true);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setLogin(null, false);
      });
  }

  //navigate to the homepage after 2sec as soon as the user logged in
  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/");
      }, 2000); // 2-second delay before navigation
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {/* {!isLoggedIn && ( */}
      <>
        <div className="background-login">
          <div className="shape-login"></div>
          <div className="shape-login"></div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Login</h3>
          <p>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userNameValue}
              onChange={handleUserName}
            />
          </p>

          <p>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordValue}
              onChange={handlePassword}
            />
          </p>

          {isLoggedIn && (
            <p>
              <h2 className="success-login">
                Successfully logged in! Redirecting...
              </h2>
            </p>
          )}

          {errorMessage && (
            <p>
              <h2 className="error-login-page">{errorMessage}</h2>
            </p>
          )}

          <button id="login-button" type="submit">
            Login
          </button>
        </form>
      </>
      {/* )} */}

      {/* {isLoggedIn && result && (
        <div>
          <p>Logged in as user with ID: {result.userId}</p>
        </div>
      )}
      {error && <p>Error: {error}</p>} */}
    </>
  );
}
