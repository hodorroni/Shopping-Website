import "./Header.css";
import { useNavigate } from "react-router-dom";
export default function Header({ amountCart, isLogged, handleLogOut }) {
  const navigate = useNavigate();
  function aboutHandleClick() {
    navigate("/about");
  }
  function cartHandleClick() {
    navigate("/cart");
  }
  function handleSignUp() {
    navigate("/Signup");
  }
  function handleLogin() {
    navigate("/login");
  }
  function handleHome() {
    navigate("/");
  }
  function userPanelHandleClick() {
    navigate("/userPanel");
  }
  return (
    <>
      <header>
        <div className="header">
          <a onClick={handleHome} className="logo">
            Shopping Website
          </a>
          <div className="link">
            <a onClick={handleHome}>Home</a>
            <a onClick={aboutHandleClick}>About us</a>
            <a onClick={cartHandleClick}>Cart</a>
            {isLogged && <a onClick={userPanelHandleClick}>UserPanel</a>}
          </div>
          <div className="login">
            <div className="cart-icon">
              <a onClick={cartHandleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="white"
                  className="bi bi-cart4"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                </svg>
              </a>
              <span className={amountCart === 0 ? "" : "amount-cart"}>
                {amountCart === 0 ? "" : amountCart}
              </span>
            </div>
            {!isLogged && (
              <div>
                <button className="login-button-header" onClick={handleLogin}>
                  Login
                </button>
                <button onClick={handleSignUp} className="signup">
                  Signup
                </button>
              </div>
            )}
            {isLogged && (
              <div>
                <button
                  className="logOut-btn"
                  onClick={() => handleLogOut("", false)}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
