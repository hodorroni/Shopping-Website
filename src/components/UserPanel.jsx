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
  console.log(userIdLogged);
  console.log(isLogged);
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
  function handleSaveUsername() {
    setEditUser(false);
    handleDataBaseSave();
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
  function handleSaveFirstname() {
    setFirstnameClicked(false);
    handleDataBaseSave();
  }

  // end of firstname section handle

  //Handling password section

  function handleInputPassword(event) {
    setNewPassword(event.target.value);
  }

  function handleCancelPassword() {
    setPasswordClicked(false);
  }
  function handleSavePassword() {
    setPasswordClicked(false);
    handleDataBaseSave();
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
  function handleSaveLastname() {
    setLastnameClicked(false);
    handleDataBaseSave();
  }
  function handleLastnameClick() {
    setLastnameClicked(true);
  }
  //end of lastname section

  function handleDataBaseSave() {
    const newObject = {
      ...userDetails,
      username: changedUserName || userDetails.username,
      firstname: changedFirstname || userDetails.firstname,
      lastname: changedLastname || userDetails.lastname,
      password: changedPassword || userDetails.password,
    };
    if (newObject.username === userDetails.username) {
      return;
    } else {
      fetch("http://localhost:5000/updateUserDetails", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newObject: newObject,
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
          // <div className="all-users-flex-row">
          //   <p>{index}.</p>
          //   <p className="popUp-username popUp-flexbasis">{value.username}</p>
          //   <p className="popUp-flexbasis">
          //     {value.firstname} {value.lastname}
          //   </p>
          //   <svg
          //     className="popUp-flexbasis"
          //     onClick={handleDeleteUser}
          //     xmlns="http://www.w3.org/2000/svg"
          //     x="0px"
          //     y="0px"
          //     width="100"
          //     height="100"
          //     viewBox="0,0,256,256"
          //   >
          //     <g transform="translate(6.4,6.4) scale(0.95,0.95)">
          //       <g
          //         fill="none"
          //         fill-rule="nonzero"
          //         stroke-opacity="0.96863"
          //         stroke="#3cc920"
          //         stroke-width="64"
          //         stroke-linecap="butt"
          //         stroke-linejoin="miter"
          //         stroke-miterlimit="10"
          //         stroke-dasharray=""
          //         stroke-dashoffset="0"
          //         font-family="none"
          //         font-weight="none"
          //         font-size="none"
          //         text-anchor="none"
          //         style={{ mixBlendMode: "normal" }}
          //       >
          //         <path
          //           d="M63.62729,218.66578c-14.52127,0 -26.29308,-11.77181 -26.29308,-26.29308v-128.74541c0,-14.52127 11.77181,-26.29308 26.29308,-26.29308h128.74541c14.52127,0 26.29308,11.77181 26.29308,26.29308v128.74541c0,14.52127 -11.77181,26.29308 -26.29308,26.29308z"
          //           id="shape"
          //         ></path>
          //       </g>
          //       <g
          //         fill="none"
          //         fill-rule="nonzero"
          //         stroke="none"
          //         stroke-width="none"
          //         stroke-linecap="butt"
          //         stroke-linejoin="none"
          //         stroke-miterlimit="10"
          //         stroke-dasharray=""
          //         stroke-dashoffset="0"
          //         font-family="none"
          //         font-weight="none"
          //         font-size="none"
          //         text-anchor="none"
          //         style={{ mixBlendMode: "normal" }}
          //       >
          //         <path
          //           transform="scale(2.56,2.56)"
          //           d="M75.61719,5.73438c1.09676,3.64766 1.36453,6.41004 1.0625,8.65234c-0.1057,0.78471 -0.28788,1.49776 -0.51953,2.1582c0.37794,0.13834 0.70535,0.38748 0.93945,0.71484c1.97701,2.67471 2.44947,5.34675 2.30273,7.57227c-0.00726,0.1059 -0.02293,0.21104 -0.04687,0.31445c0.00867,0.10725 0.00867,0.21502 0,0.32227l-1.57422,21.67773c1.05693,14.5118 1.39989,27.80968 1.10742,40.03125c-0.02152,0.9025 -0.6449,1.67873 -1.52148,1.89453c-17.03818,4.1862 -35.88682,4.51958 -52.13867,-0.01562c-0.90858,-0.25438 -1.51583,-1.1091 -1.45703,-2.05078c1.09509,-17.5281 -1.12142,-36.5261 -0.00195,-60.04297c0.01109,-0.23241 0.06265,-0.4611 0.15234,-0.67578c-0.23761,-0.44499 -0.2983,-0.96333 -0.16992,-1.45117c-0.0127,-0.04536 -0.62907,-2.27839 0.6543,-4.43164c1.29651,-2.1753 4.15826,-4.1926 9.82422,-5.34961c0.11056,-0.02379 0.22294,-0.03817 0.33594,-0.04297c0.28368,-0.01193 0.56664,0.03668 0.83008,0.14258l2.14453,-3.33008c0.18269,-0.28397 0.49633,-0.45659 0.83398,-0.45899c0.30523,-0.00137 0.59438,0.13673 0.78516,0.375l2.57031,3.20313l5.86328,-4.20117c0.21088,-0.1508 0.47207,-0.21383 0.72852,-0.17578l6.50391,0.96094l4.94531,-5.6875c0.19555,-0.225 0.48128,-0.35104 0.7793,-0.34375c0.23595,0.00599 0.46218,0.09524 0.63867,0.25195l3.62109,3.20508c4.4571,-3.87616 9.84888,-3.93164 9.84961,-3.93164c0.44137,0.00042 0.83028,0.29011 0.95703,0.71289z"
          //           id="strokeMainSVG"
          //           fill="#dddddd"
          //           stroke="#dddddd"
          //           stroke-width="4"
          //           stroke-linejoin="round"
          //         ></path>
          //         <g
          //           transform="scale(2.56,2.56)"
          //           fill="#000000"
          //           stroke="none"
          //           stroke-width="1"
          //           stroke-linejoin="miter"
          //         >
          //           <path d="M74.66016,5.02148c-0.00073,0 -5.39251,0.05548 -9.84961,3.93164l-3.62109,-3.20508c-0.17649,-0.15672 -0.40272,-0.24596 -0.63867,-0.25195c-0.29801,-0.00729 -0.58375,0.11875 -0.7793,0.34375l-4.94531,5.6875l-6.50391,-0.96094c-0.25644,-0.03805 -0.51764,0.02498 -0.72852,0.17578l-5.86328,4.20117l-2.57031,-3.20312c-0.19078,-0.23827 -0.47992,-0.37637 -0.78516,-0.375c-0.33765,0.0024 -0.6513,0.17501 -0.83398,0.45899l-2.14453,3.33008c-0.26344,-0.1059 -0.5464,-0.15451 -0.83008,-0.14258c-0.11299,0.0048 -0.22537,0.01917 -0.33594,0.04297c-5.66596,1.15701 -8.52771,3.1743 -9.82422,5.34961c-1.28336,2.15325 -0.667,4.38628 -0.6543,4.43164c-0.12838,0.48784 -0.06769,1.00618 0.16992,1.45117c-0.0897,0.21469 -0.14125,0.44338 -0.15234,0.67578c-1.11947,23.51687 1.09704,42.51487 0.00195,60.04297c-0.0588,0.94168 0.54845,1.7964 1.45703,2.05078c16.25185,4.53521 35.10049,4.20183 52.13867,0.01563c0.87658,-0.2158 1.49997,-0.99203 1.52148,-1.89453c0.29247,-12.22157 -0.05049,-25.51945 -1.10742,-40.03125l1.57422,-21.67773c0.00867,-0.10725 0.00867,-0.21502 0,-0.32227c0.02394,-0.10341 0.03962,-0.20856 0.04688,-0.31445c0.14674,-2.22552 -0.32572,-4.89755 -2.30273,-7.57227c-0.2341,-0.32737 -0.56152,-0.5765 -0.93945,-0.71484c0.23165,-0.66045 0.41383,-1.37349 0.51953,-2.1582c0.30203,-2.2423 0.03426,-5.00469 -1.0625,-8.65234c-0.12675,-0.42278 -0.51566,-0.71248 -0.95703,-0.71289zM73.87305,7.08789c0.82276,3.01293 1.05444,5.32207 0.82422,7.03125c-0.21478,1.59456 -0.79001,2.7465 -1.51172,3.82031l-10.29492,-3.06836c0.65533,-1.37258 1.42746,-2.49504 2.25391,-3.42773c-0.00462,0.36705 0.06574,0.76248 0.27734,1.12891c0.33886,0.58682 0.92987,1.02942 1.74414,1.36719c0.94746,0.39351 1.96148,0.26575 2.64648,-0.22851c0.685,-0.49427 1.06085,-1.25885 1.09766,-2.05859c0.03681,-0.79974 -0.32822,-1.69083 -1.10937,-2.21094c-0.39058,-0.26006 -0.85242,-0.42167 -1.37695,-0.48437c-0.09766,-0.01168 -0.20857,-0.00295 -0.31055,-0.00781c2.42673,-1.47361 4.76461,-1.79644 5.75977,-1.86133zM60.61914,7.91406l2.76367,2.44727c-1.10811,1.26508 -2.10413,2.82335 -2.86328,4.75977c-0.10242,0.26048 -0.09099,0.55196 0.0315,0.80363c0.12249,0.25167 0.34484,0.44049 0.61303,0.52059l6.9375,2.06641l-0.66992,1.63281l-5.29883,-1.47852c-0.348,-0.10854 -0.7275,-0.01913 -0.99045,0.23335c-0.26295,0.25248 -0.36769,0.62803 -0.27337,0.98016c0.09432,0.35212 0.37277,0.62504 0.72671,0.71227l5.07422,1.41602l-1.17969,2.88086l-3.24219,-1.04492c-0.34417,-0.12558 -0.72946,-0.05291 -1.00426,0.1894c-0.27479,0.24231 -0.39509,0.61548 -0.31357,0.97266c0.08153,0.35718 0.35183,0.6412 0.70454,0.74028l2.82617,0.91211c-2.01639,0.37763 -4.02148,0.65689 -6,0.85156c0.00479,-0.04802 0.00609,-0.09632 0.00391,-0.14453l-0.47656,-10.25977c-0.01437,-0.307 -0.16909,-0.59034 -0.41959,-0.76839c-0.2505,-0.17806 -0.56895,-0.23105 -0.86361,-0.14372l-11.28906,3.3418l-2.43164,-3.03125l5.44727,-3.90039l6.64258,0.98242c0.33774,0.05065 0.67798,-0.07455 0.90234,-0.33203zM68.21289,11.00781c0.23,0.01196 0.40042,0.04566 0.47852,0.09766c0.19119,0.1273 0.23002,0.25269 0.2207,0.45508c-0.0093,0.20238 -0.12958,0.42691 -0.27148,0.5293c-0.1419,0.10239 -0.28645,0.1774 -0.70898,0.00195c-0.55623,-0.23073 -0.73482,-0.4425 -0.7793,-0.51953c-0.04448,-0.07703 -0.04021,-0.07768 -0.00781,-0.18945c0.03769,-0.13008 0.13058,-0.21722 0.23047,-0.34375c0.31831,-0.03342 0.60789,-0.04321 0.83789,-0.03125zM38.4707,14.07617l5.80469,7.23438c0.25448,0.31656 0.67513,0.44777 1.06445,0.33203l10.70898,-3.16992l0.41797,8.98438c0.00344,0.07465 0.01523,0.14868 0.03516,0.2207c-4.66365,0.33463 -9.1297,0.22633 -13.125,-0.14062c-4.76415,-0.43757 -8.86194,-1.22996 -11.80664,-2.00977c-0.14944,-0.03957 -0.25889,-0.07769 -0.40234,-0.11719l4.21289,-6.53711c0.80483,-0.31433 1.31684,-1.10992 1.26953,-1.97266zM70.02734,19.08594l3.32422,0.99023c0.25884,0.07695 0.5378,0.04595 0.77344,-0.08594c0.93634,1.36454 1.2467,2.44433 1.29492,3.54102c-2.35111,0.93031 -4.73737,1.68669 -7.13086,2.28906c-0.06689,-0.04078 -0.13835,-0.07355 -0.21289,-0.09766l-0.67773,-0.21875l1.21094,-2.95312l1.9668,0.54883c0.34438,0.09601 0.71381,0.00098 0.96912,-0.24928c0.25531,-0.25026 0.35769,-0.61773 0.26858,-0.96395c-0.08911,-0.34623 -0.35618,-0.6186 -0.70059,-0.7145l-1.74023,-0.48633zM32.51563,19.625l-3.08008,4.7832c-0.08692,0.12929 -0.14243,0.2771 -0.16211,0.43164c-0.42935,-0.14339 -0.84955,-0.28619 -1.16602,-0.41211c-0.20928,-0.08327 -0.30657,-0.137 -0.45898,-0.20703c0.00197,-0.22791 -0.03502,-0.45448 -0.10938,-0.66992c0,0 -0.21651,-0.22841 0.30273,-1.09961c0.41916,-0.70328 1.59767,-1.86274 4.67383,-2.82617zM75.16797,27.90625l-1.38281,19.06836c-0.00707,0.09688 -0.00707,0.19414 0,0.29102c0.03015,0.41198 0.05311,0.8128 0.08203,1.22266c-1.87492,0.82786 -3.84131,0.85156 -6.97852,0.85156c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587c2.83605,0 5.01731,0.00234 7.12109,-0.75195c0.82896,12.55536 1.08539,24.12205 0.87695,34.87891c-9.25328,2.13113 -19.01104,3.06307 -28.48828,2.67578l0.63086,-1.91406c0.10518,-0.30496 0.0568,-0.64194 -0.12993,-0.90499c-0.18673,-0.26305 -0.48888,-0.41988 -0.81147,-0.42118c-0.43836,-0.00229 -0.82711,0.28116 -0.95898,0.69922l-0.80469,2.4375c-1.03156,-0.06371 -2.0577,-0.14427 -3.08008,-0.24023l1.14453,-1.60742c0.22263,-0.30337 0.25614,-0.70603 0.0867,-1.04203c-0.16944,-0.33599 -0.51314,-0.54844 -0.88943,-0.54977c-0.3297,-0.0011 -0.63877,0.16037 -0.82617,0.43164l-1.80078,2.53125c-0.80584,-0.0956 -1.6064,-0.20397 -2.4043,-0.32031l1.2207,-2.44336c0.16492,-0.3182 0.14697,-0.70032 -0.04706,-1.00165c-0.19403,-0.30133 -0.53447,-0.4758 -0.89239,-0.45733c-0.36508,0.01873 -0.69085,0.23517 -0.84961,0.56445l-1.50195,3.00586c-1.1052,-0.18819 -2.20163,-0.39547 -3.28711,-0.625l1.57813,-3.1543c0.16514,-0.31852 0.147,-0.70108 -0.04752,-1.00255c-0.19452,-0.30147 -0.53562,-0.47564 -0.89389,-0.45643c-0.36436,0.01943 -0.68923,0.23576 -0.84766,0.56445l-1.66797,3.33398c-0.04195,0.08521 -0.07154,0.17597 -0.08789,0.26953c-0.47534,-0.11303 -0.95506,-0.21855 -1.42578,-0.33984c0.87183,-17.15489 -1.01731,-35.17404 -0.09375,-56.9707c0.82603,0.28592 1.73845,0.5746 2.83594,0.86523c0.64549,0.17094 1.36636,0.33938 2.09961,0.50586l-1.66016,3.32227c-0.17197,0.32106 -0.15581,0.71022 0.04219,1.01591c0.198,0.30569 0.54653,0.47957 0.90984,0.45392c0.36331,-0.02565 0.68395,-0.24678 0.83703,-0.57725l1.66602,-3.33398c0.07728,-0.14952 0.11557,-0.31612 0.11133,-0.48437c0.92304,0.1828 1.8933,0.35334 2.91602,0.51563l-0.92578,1.85352c-0.15991,0.3196 -0.13713,0.70024 0.05975,0.99849c0.19688,0.29825 0.53794,0.46878 0.89467,0.44734c0.35673,-0.02144 0.67491,-0.23161 0.83464,-0.55129l1.21484,-2.43164c1.05507,0.13988 2.15183,0.26458 3.28516,0.37109l-1.00586,1.375c-0.22039,0.28772 -0.26788,0.67215 -0.12413,1.00485c0.14376,0.3327 0.45626,0.56159 0.81682,0.59828c0.36057,0.03669 0.71276,-0.12456 0.92059,-0.42149l1.74609,-2.38477c0.88544,0.05961 1.76686,0.11899 2.6875,0.15234l-0.68555,1.56055c-0.22221,0.5059 0.00777,1.09615 0.51367,1.31836c0.5059,0.22221 1.09615,-0.00777 1.31836,-0.51367l1.01758,-2.31445c0.89877,0.00994 1.80684,0.0081 2.73047,-0.01172l-0.73242,1.46484c-0.24702,0.49404 -0.04677,1.09478 0.44727,1.3418c0.49404,0.24702 1.09478,0.04677 1.3418,-0.44727l1.21875,-2.4375c1.04764,-0.05169 2.11005,-0.13044 3.17969,-0.22656l-0.73828,2.36914c-0.10617,0.34125 -0.02219,0.71322 0.2203,0.97575c0.24249,0.26253 0.60664,0.37572 0.95523,0.29692c0.34859,-0.0788 0.62864,-0.33762 0.73463,-0.67892l0.99414,-3.18945c1.06975,-0.12708 2.14579,-0.2772 3.22852,-0.45508l-0.86719,1.37891c-0.20183,0.30234 -0.22371,0.6904 -0.05715,1.01351c0.16657,0.32312 0.49534,0.53041 0.8587,0.5414c0.36336,0.01099 0.70406,-0.17605 0.88985,-0.48851l1.84766,-2.93164c1.26385,-0.25843 2.53246,-0.56443 3.80078,-0.90234l-1.24023,3.50391c-0.11944,0.33706 -0.04995,0.71224 0.18228,0.98416c0.23223,0.27192 0.59192,0.39927 0.94352,0.33404c0.3516,-0.06523 0.64167,-0.31311 0.76092,-0.65024l1.24414,-3.51367c0.14572,-0.39284 0.03112,-0.83487 -0.28711,-1.10742c1.16047,-0.34184 2.31955,-0.71654 3.47461,-1.13281zM36.99609,36.33398c-0.86902,0 -1.70291,0.3357 -2.31836,0.94531c-0.61691,0.61108 -0.9544,1.45295 -0.91406,2.31641c0,0.00065 0,0.0013 0,0.00195c0.15998,3.34258 0.44553,9.23384 0.44922,9.31055l-1.10937,18.38281c-0.00258,0.03575 -0.00323,0.07161 -0.00195,0.10742c0,0 0.28527,6.17517 0.44727,9.70703c0.08612,1.89887 1.73032,3.36133 3.64844,3.36133h1.13477c1.55052,0 2.88281,-1.22764 2.88281,-2.7832v-26.12891c0.0051,-0.36064 -0.18438,-0.69608 -0.49587,-0.87789c-0.3115,-0.18181 -0.69676,-0.18181 -1.00825,0c-0.3115,0.18181 -0.50097,0.51725 -0.49587,0.87789v26.12891c0,0.41444 -0.35734,0.7832 -0.88281,0.7832h-1.13477c-0.92188,0 -1.61451,-0.66004 -1.65039,-1.45117c0,-0.00065 0,-0.0013 0,-0.00195c-0.161,-3.51012 -0.44181,-9.57031 -0.44531,-9.64648l1.10938,-18.38672c0.002,-0.03643 0.002,-0.07294 0,-0.10937c0,0 -0.28823,-6.00544 -0.44922,-9.36914c-0.01367,-0.29255 0.09318,-0.57581 0.32227,-0.80273c0.22855,-0.22638 0.56113,-0.36523 0.91211,-0.36523h0.03125c0.59462,0 1.15959,0.22628 1.56641,0.61133c0.405,0.38534 0.62109,0.88941 0.62109,1.41016v5.40625c-0.0051,0.36064 0.18438,0.69608 0.49587,0.87789c0.3115,0.18181 0.69676,0.18181 1.00825,0c0.3115,-0.18181 0.50097,-0.51725 0.49587,-0.87789v-5.40625c0,-1.08065 -0.45605,-2.11284 -1.24414,-2.86133c-0.00065,-0.00065 -0.0013,-0.0013 -0.00195,-0.00195c-0.78918,-0.74695 -1.84403,-1.1582 -2.94141,-1.1582zM64.22656,36.33398c-0.86902,0 -1.70486,0.3357 -2.32031,0.94531c-0.61483,0.61046 -0.95445,1.4518 -0.91406,2.31641c0,0.00065 0,0.0013 0,0.00195c0.15997,3.34258 0.44553,9.23384 0.44922,9.31055l-1.10937,18.38281c-0.00258,0.03575 -0.00323,0.07161 -0.00195,0.10742c0,0 0.28425,6.17465 0.44727,9.70703c0.08612,1.89887 1.73031,3.36133 3.64844,3.36133h1.13672c1.55052,0 2.88086,-1.22764 2.88086,-2.7832v-22.96875c0.0051,-0.36064 -0.18438,-0.69608 -0.49587,-0.87789c-0.3115,-0.18181 -0.69676,-0.18181 -1.00825,0c-0.3115,0.18181 -0.50097,0.51725 -0.49587,0.87789v22.96875c0,0.41444 -0.35538,0.7832 -0.88086,0.7832h-1.13672c-0.92188,0 -1.61451,-0.66004 -1.65039,-1.45117c0,-0.00065 0,-0.0013 0,-0.00195c-0.16197,-3.50961 -0.44182,-9.57031 -0.44531,-9.64648l1.10938,-18.38672c0.00265,-0.0364 0.0033,-0.07291 0.00195,-0.10937c0,0 -0.29019,-6.00544 -0.45117,-9.36914c-0.01361,-0.2914 0.09505,-0.5752 0.32422,-0.80273c0.22855,-0.22638 0.56113,-0.36523 0.91211,-0.36523h0.03125c0.59398,0 1.15774,0.22704 1.56445,0.61133c0.40614,0.38509 0.62109,0.88797 0.62109,1.41016v5.40625c-0.0051,0.36064 0.18438,0.69608 0.49587,0.87789c0.3115,0.18181 0.69676,0.18181 1.00825,0c0.3115,-0.18181 0.50097,-0.51725 0.49587,-0.87789v-5.40625c0,-1.07982 -0.45428,-2.11241 -1.24414,-2.86133c0,-0.00065 0,-0.0013 0,-0.00195c-0.78923,-0.74691 -1.84403,-1.1582 -2.94141,-1.1582zM50.52344,37.38672c-1.91271,0 -3.5525,1.45376 -3.64844,3.3457c-0.16299,3.25186 -0.43555,8.66602 -0.43555,8.66602c-0.00134,0.03647 -0.00069,0.07298 0.00195,0.10937l1.10938,18.39063c-0.0031,0.077 -0.31059,7.58217 -0.4668,11.43359c-0.03436,0.86203 0.30704,1.69714 0.91992,2.30273c0.00065,0.0013 0.0013,0.00261 0.00195,0.00391c0.61506,0.6034 1.44682,0.93359 2.3125,0.93359h0.04688c1.09659,0 2.1518,-0.40889 2.94141,-1.15625c0,-0.00065 0,-0.0013 0,-0.00195c0.78986,-0.74891 1.24609,-1.78151 1.24609,-2.86133v-7.51367c0.0051,-0.36064 -0.18438,-0.69608 -0.49587,-0.87789c-0.3115,-0.18181 -0.69676,-0.18181 -1.00825,0c-0.3115,0.18181 -0.50097,0.51725 -0.49587,0.87789v7.51367c0,0.52218 -0.21495,1.02507 -0.62109,1.41016c-0.40639,0.38464 -0.971,0.60938 -1.56641,0.60938h-0.04687c-0.34942,0 -0.67932,-0.13581 -0.9082,-0.35937l-0.00195,-0.00195c-0.22779,-0.22597 -0.33582,-0.50772 -0.32422,-0.79883c0.15699,-3.87084 0.4668,-11.49219 0.4668,-11.49219c0.001,-0.03322 0.00035,-0.06646 -0.00195,-0.09961l-1.10742,-18.38281c0.0038,-0.07481 0.26977,-5.37412 0.43164,-8.60352c0.04006,-0.79006 0.7311,-1.44727 1.65039,-1.44727h1.14844c0.2465,0 0.47972,0.09583 0.64063,0.24805c0.16193,0.15367 0.23828,0.34123 0.23828,0.53516v25.07617c-0.0051,0.36064 0.18438,0.69608 0.49587,0.87789c0.3115,0.18181 0.69676,0.18181 1.00825,0c0.3115,-0.18181 0.50097,-0.51725 0.49587,-0.87789v-25.07617c0,-0.75207 -0.31921,-1.47 -0.86328,-1.98633c0,-0.00065 0,-0.0013 0,-0.00195c-0.5431,-0.51373 -1.26412,-0.79492 -2.01562,-0.79492zM71.33398,71.57031c-0.613,0 -1.11133,0.49833 -1.11133,1.11133c0,0.613 0.49733,1.11133 1.11133,1.11133c0.614,0 1.11133,-0.49733 1.11133,-1.11133c0,-0.613 -0.49733,-1.11133 -1.11133,-1.11133zM72.0293,77.61523c-0.614,0 -1.10937,0.49833 -1.10937,1.11133c0,0.613 0.49537,1.11133 1.10938,1.11133c0.613,0 1.11133,-0.49733 1.11133,-1.11133c0,-0.614 -0.49833,-1.11133 -1.11133,-1.11133zM68.48242,82.50781c-0.614,0 -1.11133,0.49833 -1.11133,1.11133c0,0.613 0.49733,1.11133 1.11133,1.11133c0.613,0 1.11133,-0.49833 1.11133,-1.11133c0,-0.614 -0.49833,-1.11133 -1.11133,-1.11133z"></path>
          //         </g>
          //       </g>
          //     </g>
          //   </svg>
          // </div>
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
                onClick={handleSaveUsername}
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
                onClick={handleSaveFirstname}
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
                onClick={handleSavePassword}
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
                onClick={handleSaveLastname}
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
