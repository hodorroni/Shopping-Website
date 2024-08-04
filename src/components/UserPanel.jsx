import { useEffect, useState } from "react";
import UserPanelManageUsers from "./UserPanelManageUsers";
import { useNavigate } from "react-router-dom";
import "./UserPanel.css";
import Header from "./Header";
export default function UserPanel({
  cartItems,
  userIdLogged,
  isLogged,
  handleLogOut,
}) {
  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [userError, setUserError] = useState("");
  const [createdAt, setCreated] = useState({ date: "", time: "" });
  const [editUserClicked, setEditUser] = useState(false);
  const [changedUserName, setNewUserName] = useState("");
  const [editFirstnameClicked, setFirstnameClicked] = useState(false);
  const [changedFirstname, setNewFirstname] = useState("");
  const [editPasswordClicked, setPasswordClicked] = useState(false);
  const [changedPassword, setNewPassword] = useState("");
  const [editLastnameClicked, setLastnameClicked] = useState(false);
  const [changedLastname, setNewLastname] = useState("");
  const [allDatabaseUsers, setAllDatabaseUsers] = useState([]);
  const [allUsersPopUp, setUsersPopUp] = useState(false);
  const [userNameFirstValue, setUserNameFirstValue] = useState("");
  const navigate = useNavigate();
  const isUserAdmin = userDetails.isAdmin === true;
  function formatTimestamp(timestamp) {
    const dateObject = new Date(timestamp);

    // Extract date components
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Months are zero-based
    const day = dateObject.getDate();

    // Extract time components
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();

    // Format date and time
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setCreated({ date: formattedDate, time: formattedTime });
  }

  function getUserItems() {
    if (!userIdLogged) {
      navigate("/");
    } else {
      fetch("http://localhost:5000/get-user-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userIdLogged,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Error");
            });
          }
          return response.json();
        })
        .then((data) => {
          setUserItems(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }

  function getUserDetails() {
    fetch("http://localhost:5000/get-user-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userIdLogged,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Error");
          });
        }
        return response.json();
      })
      .then((data) => {
        setUserDetails(data);
        setNewUserName(data.username);
        setNewFirstname(data.firstname);
        setNewPassword(data.password);
        setUserNameFirstValue(data.username);
        setNewLastname(data.lastname);
        formatTimestamp(data.createdAt);
      })
      .catch((err) => {
        setUserError(err.message);
      });
  }

  // Handling the edit username section
  function handleEditUser() {
    setEditUser(true);
  }
  function handleInputUserName(event) {
    setNewUserName(event.target.value);
  }
  function handleCancelUserName() {
    setEditUser(false);
  }
  function handleSaveUsername(event) {
    setEditUser(false);
    handleDataBaseSave(event);
  }
  // finished section if edit username

  // Handling the edit firstname section
  function handleInputFirstname(event) {
    setNewFirstname(event.target.value);
  }
  function handleFirstNameClick() {
    setFirstnameClicked(true);
  }

  function handleCancelFirstname() {
    setFirstnameClicked(false);
  }
  function handleSaveFirstname(event) {
    setFirstnameClicked(false);
    handleDataBaseSave(event);
  }

  // end of firstname section handle

  //Handling password section

  function handleInputPassword(event) {
    setNewPassword(event.target.value);
  }

  function handleCancelPassword() {
    setPasswordClicked(false);
  }
  function handleSavePassword(event) {
    setPasswordClicked(false);
    handleDataBaseSave(event);
  }
  function handlePasswordClick() {
    setPasswordClicked(true);
  }
  //end of password section

  //Handling lastname section

  function handleInputLastname(event) {
    setNewLastname(event.target.value);
  }

  function handleCancelLastname() {
    setLastnameClicked(false);
  }
  function handleSaveLastname(event) {
    setLastnameClicked(false);
    handleDataBaseSave(event);
  }
  function handleLastnameClick() {
    setLastnameClicked(true);
  }
  //end of lastname section

  function handleDataBaseSave(event) {
    event.preventDefault();
    const newObject = {
      ...userDetails,
      username: changedUserName || userDetails.username,
      firstname: changedFirstname || userDetails.firstname,
      lastname: changedLastname || userDetails.lastname,
      password: changedPassword || userDetails.password,
    };
    const hasUserChanged = newObject.username === userNameFirstValue;

    fetch("http://localhost:5000/updateUserDetails", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newObject: newObject,
        hasUserNameChanged: hasUserChanged,
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
        setUserDetails(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function openListOfUsers() {
    fetch("http://localhost:5000/getAllUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentId: userIdLogged,
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
        setAllDatabaseUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function handleManageUsers() {
    setUsersPopUp(true);
  }
  function handleClosePopUp() {
    setUsersPopUp(false);
  }

  const showAllUsers = allUsersPopUp ? (
    <>
      <div className="users-pop-up">
        <div className="all-users-flex-row header-allUsers">
          <p>Username</p>
          <p>Full Name</p>
        </div>

        {allDatabaseUsers.map((value, index) => (
          <UserPanelManageUsers
            setUsersPopUp={setUsersPopUp}
            key={index}
            value={value}
            index={index}
            setAllDatabaseUsers={setAllDatabaseUsers}
            currentId={userIdLogged}
          />
        ))}
        <div className="users-pop-up-button">
          <button className="close-popUp" onClick={handleClosePopUp}>
            Close
          </button>
        </div>
      </div>
    </>
  ) : (
    <></>
  );

  useEffect(() => {
    getUserItems();
    getUserDetails();
    openListOfUsers();
  }, [userIdLogged]);

  const userInputShow = !editUserClicked ? (
    <>
      <p>Edit username</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100px"
        height="50px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5" />
        <path
          d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
          stroke="#1C274C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </>
  ) : (
    <>
      <input
        type="text"
        onChange={handleInputUserName}
        value={changedUserName}
      />
    </>
  );

  const firstNameInputShow = !editFirstnameClicked ? (
    <>
      <p>Edit firstname</p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/6135/6135265.png"
        alt="edit Name"
        width="100px"
        height="50px"
      />
    </>
  ) : (
    <>
      <input
        type="text"
        onChange={handleInputFirstname}
        value={changedFirstname}
      />
    </>
  );

  const passwordInputShow = !editPasswordClicked ? (
    <>
      <p>Edit password</p>
      <img
        className="editPasswordImage"
        src="https://static.vecteezy.com/system/resources/previews/010/702/533/non_2x/password-reset-icon-flat-design-vector.jpg"
        alt="edit password"
        width="100px"
        height="80px"
      />
    </>
  ) : (
    <>
      <input
        type="text"
        onChange={handleInputPassword}
        value={changedPassword}
      />
    </>
  );

  const lastnameInputShow = !editLastnameClicked ? (
    <>
      <p>Edit lastname</p>
      <img
        className="editPasswordImage"
        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/title-2833767-2354914.png"
        alt="edit password"
        width="90px"
        height="100px"
      />
    </>
  ) : (
    <input type="text" onChange={handleInputLastname} value={changedLastname} />
  );

  return (
    <>
      <Header
        amountCart={cartItems.length}
        isLogged={isLogged}
        handleLogOut={() => handleLogOut(null, false)}
      />
      <div className="side-bar">
        <ul>
          <li onClick={handleEditUser}>
            <div className="side-bar-li-flex">{userInputShow}</div>
          </li>
          {editUserClicked && (
            <div className="side-bar-li-flex">
              <button
                onClick={handleCancelUserName}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={(event) => handleSaveUsername(event)}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          )}
          <li onClick={handleFirstNameClick}>
            <div className="side-bar-li-flex">{firstNameInputShow}</div>
          </li>
          {editFirstnameClicked && (
            <div className="side-bar-li-flex">
              <button
                onClick={handleCancelFirstname}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={(event) => handleSaveFirstname(event)}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          )}
          <li onClick={handlePasswordClick}>
            <div className="side-bar-li-flex">{passwordInputShow}</div>
          </li>
          {editPasswordClicked && (
            <div className="side-bar-li-flex">
              <button
                onClick={handleCancelPassword}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={(event) => handleSavePassword(event)}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          )}
          <li onClick={handleLastnameClick}>
            <div className="side-bar-li-flex">{lastnameInputShow}</div>
          </li>
          {editLastnameClicked && (
            <div className="side-bar-li-flex">
              <button
                onClick={handleCancelLastname}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={(event) => handleSaveLastname(event)}
                style={{ width: "100%", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          )}
        </ul>
      </div>

      {/* end sidebar */}
      {!error && !userError && (
        <div className="content-container-userPanel">
          {showAllUsers}
          <div className="container-header-dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="30"
              viewBox="0,0,256,256"
            >
              <g
                fill="#fc19f0"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <path d="M0,256v-256h256v256z" id="bgRectangle"></path>
              </g>
              <g
                fill="#ffffff"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <g transform="scale(5.33333,5.33333)">
                  <path d="M24,2.99805c-0.95784,0 -1.91565,0.33287 -2.68359,0.99609l-17.5293,15.13867c-0.0013,0.00065 -0.00261,0.0013 -0.00391,0.00195c-0.73112,0.63533 -0.91428,1.6465 -0.62109,2.43359c0.29319,0.7871 1.09765,1.43164 2.06836,1.43164h2.76953h28c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-28h-2.76953c-0.14929,0 -0.16155,-0.04546 -0.19336,-0.13086c-0.03181,-0.0854 -0.05028,-0.12999 0.05859,-0.22461l17.52734,-15.13867c0.79611,-0.68755 1.95779,-0.68755 2.75391,0l6.96875,6.02148c0.29621,0.25617 0.71468,0.31588 1.07071,0.15278c0.35603,-0.16309 0.58412,-0.51899 0.58359,-0.9106v-4.76953h3v9.08984c-0.00044,0.29086 0.12575,0.5675 0.3457,0.75781l5.55859,4.79688c0.10888,0.09462 0.0904,0.13921 0.05859,0.22461c-0.03181,0.0854 -0.04407,0.13086 -0.19336,0.13086h-2.76953c-0.55226,0.00006 -0.99994,0.44774 -1,1v20c0,0.56503 -0.43497,1 -1,1h-7c-0.56503,0 -1,-0.43497 -1,-1v-10c0,-1.64545 -1.35455,-3 -3,-3h-6c-1.64545,0 -3,1.35455 -3,3v10c0,0.56503 -0.43497,1 -1,1h-7c-0.56503,0 -1,-0.43497 -1,-1v-16c0.0051,-0.36064 -0.18438,-0.69608 -0.49587,-0.87789c-0.3115,-0.18181 -0.69676,-0.18181 -1.00825,0c-0.3115,0.18181 -0.50097,0.51725 -0.49587,0.87789v16c0,1.64497 1.35503,3 3,3h7c1.64497,0 3,-1.35503 3,-3v-10c0,-0.55455 0.44545,-1 1,-1h6c0.55455,0 1,0.44545 1,1v10c0,1.64497 1.35503,3 3,3h7c1.64497,0 3,-1.35503 3,-3v-19h1.76953c0.97071,0 1.77517,-0.64454 2.06836,-1.43164c0.29319,-0.7871 0.11003,-1.79821 -0.62109,-2.43359c-0.0013,-0.00065 -0.0026,-0.00131 -0.00391,-0.00195l-5.21289,-4.5v-8.63281c0,-1.09545 -0.90454,-2 -2,-2h-3c-1.09546,0 -2,0.90455 -2,2v2.58594l-5.31641,-4.5918c-0.76794,-0.66322 -1.72576,-0.99609 -2.68359,-0.99609z"></path>
                </g>
              </g>
            </svg>
            <p>Dashboard</p>
          </div>
          <div className="rounded-div">
            <div className="stam-div">
              <div className="stam-div-content-flex">
                <p>Listed Items:</p>
                <p>{userItems.length}</p>
              </div>
            </div>
            <div className="stam-div blueish">
              <div className="stam-div-content-flex">
                <p>Name:</p>
                <p>
                  {userDetails.firstname} {userDetails.lastname}
                </p>
              </div>
            </div>
            <div className="stam-div purpleish">
              <div className="stam-div-content-flex">
                <p>Username:</p>
                <p>{userDetails.username}</p>
              </div>
            </div>
            <div className="stam-div greish">
              <div className="stam-div-content-flex">
                <p>Created At:</p>
                <p>{createdAt.date}</p>
              </div>
            </div>
            <div className="stam-div greenish">
              <div className="stam-div-content-flex">
                <p>Current Password:</p>
                <p>{userDetails.password}</p>
              </div>
            </div>
            {isUserAdmin && (
              <div onClick={handleManageUsers} className="stam-div grey">
                <div className="stam-div-content-flex-col">
                  <p>Manage Users({allDatabaseUsers.length})</p>
                </div>
              </div>
            )}
          </div>

          {userItems.length > 0 && (
            <div className="items-container">
              <h1>Listed Items</h1>
              <div className="items-elements">
                {userItems.map((value, index) => (
                  <div className="item-image-userPanel" key={index}>
                    <img
                      key={index}
                      src={value.image}
                      alt={value.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(error || userError) && (
        <div className="content-container-userPanel">
          <p>{error ? error : ""}</p>
          <p>{userError ? userError : ""}</p>
        </div>
      )}
    </>
  );
}
