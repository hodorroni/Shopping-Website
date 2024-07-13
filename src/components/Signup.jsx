import { useState } from "react";
import "./Signup.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Signup({ isLoggedIn, setLogin }) {
  const [userNameValue, setUserName] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [firstnameValue, setFirstname] = useState("");
  const [lastnameValue, setLastname] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setError] = useState(null);
  const [adminPasswordVal, setAdminPass] = useState(false);
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

  function handleFirstname(event) {
    setFirstname(event.target.value);
  }
  function handleLastname(event) {
    setLastname(event.target.value);
  }

  function checkIsAdmin() {
    if (passwordValue == "1234") {
      setAdminPass(true);
    } else {
      setAdminPass(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      checkIsAdmin();
    }, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [passwordValue]);

  // function handleAdminPass(event) {
  //   setAdminPass(event.target.value);
  // }

  function handleSubmit(event) {
    // if (passwordValue === "1234") {
    //   setAdminPass(true);
    // }
    event.preventDefault();
    fetch("http://localhost:5000/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userNameValue,
        password: passwordValue,
        firstname: firstnameValue,
        lastname: lastnameValue,
        isAdmin: adminPasswordVal,
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
        setLogin(data.userId, true);
        setResult(data);
      })
      .catch((error) => {
        setLogin(null, false);
        setError(error.message);
      });
  }

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/");
      }, 2000); // 2-second delay before navigation
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <form className="signUp-form" onSubmit={handleSubmit}>
        <h3>Signup now!</h3>
        <p>
          <label htmlFor="username">Username</label>
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

        <p>
          <label htmlFor="firstname">First name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={firstnameValue}
            onChange={handleFirstname}
          />
        </p>
        <p>
          <label htmlFor="lastname">Last name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={lastnameValue}
            onChange={handleLastname}
          />
        </p>
        {/* <p className="admin-section">
          <label htmlFor="adminPassword">Admin Password:</label>
          <input
            type="text"
            id="adminPassword"
            name="adminPassword"
            value={adminPasswordVal}
            onChange={handleAdminPass}
          />
        </p> */}

        {isLoggedIn && (
          <p>
            <h2 className="success-login">
              Successfully Signed up! Redirecting...
            </h2>
          </p>
        )}

        {errorMessage && (
          <p>
            <h2 className="error-login">{errorMessage}</h2>
          </p>
        )}

        <button id="signUp-button" type="submit">
          Sign Up
        </button>
      </form>
      {/* {result && <div>Result: {JSON.stringify(result)}</div>}
      {error && <div>Error: {error}</div>} */}
    </>
  );
}
