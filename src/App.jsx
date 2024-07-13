import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/About";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login";
import AddItem from "./components/AddItem";
import ItemClicked from "./components/ItemClicked";
import UserPanel from "./components/UserPanel";

function App() {
  const [items, fetchedItems] = useState([]);
  const [cartItems, updateCartItems] = useState([]);
  const [isLoggedIn, setLogginIn] = useState(false);
  const [userIdLogged, setUserId] = useState(null);
  const [navigateItem, setNavigate] = useState("");
  const [searchItemsArray, setSearchItems] = useState([]);
  function handleLogIn(userId, isLogged) {
    setLogginIn(isLogged);
    setUserId(userId);
    //handling logout session
    if (isLogged === false) {
      localStorage.setItem("isLoggedIn", false);
      localStorage.setItem("userId", null);
    }
    //handling log in session
    else {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userId", userId);
      const timeUserLogged = Date.now();
      localStorage.setItem("timeUserloggedIn", timeUserLogged);
    }
  }

  //Handling the navigation when clicking on the image of the item
  function setNavigateItem(item) {
    setNavigate(item);
  }

  function handleAddItemUpdate(item) {
    fetchedItems((prevValue) => [...prevValue, item]);
  }

  //When editing an item
  function handleSpecificItem(updatedItem) {
    const newArray = items.map((item) =>
      item._id === updatedItem._id ? updatedItem : item
    );
    fetchedItems(newArray);
  }

  //when deleting an item
  function handleDeleteItem(itemToDelete) {
    const newArray = items.filter(
      (currentItem) => itemToDelete._id !== currentItem._id
    );
    fetchedItems([...newArray]);
  }

  function fetchItems() {
    fetch("http://localhost:5000/fetchItems")
      .then((response) => response.json())
      .then(async (data1) => {
        fetchedItems(data1); // First update with data1

        // Fetch items from the second API after the first fetch completes
        const response = await fetch("http://localhost:5000/db-items");
        const data2 = await response.json();
        fetchedItems((prevItems) => [...prevItems, ...data2]); // Combine data1 and data2
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    fetchItems();
  }, []);

  //checking if the user still logged in, if so get the userId and the isLoggedIn from the localStorage
  useEffect(() => {
    //checking if the user still logged in from the localStorage of the user
    const loggedInUser = localStorage.getItem("isLoggedIn");
    const storedUserId = localStorage.getItem("userId");
    const userLoggedTime = localStorage.getItem("timeUserloggedIn");
    const oneHourSessionDuration = 3600000;
    const currentTime = Date.now();
    if (currentTime - userLoggedTime <= oneHourSessionDuration) {
      if (loggedInUser && storedUserId) {
        setLogginIn(true);
        setUserId(storedUserId);
      } else {
        setLogginIn(false);
        setUserId(null);
      }
    }
    //if 1 hour has passed simply log out the user
    else {
      setLogginIn(false);
      setUserId(null);
    }
  }, []);

  function handleAddToCart(item) {
    const objectItem = {
      image: item.image,
      price: item.price,
      title: item.title,
      id: item.id,
      userCreated: item.userCreated,
      _id: item._id,
    };
    let itemExists = null;
    //check if that's one of the items that the users added manually(they have _id property only)
    if (objectItem._id) {
      itemExists = cartItems.some(
        (cartItem) => cartItem._id === objectItem._id
      );
    } else {
      // check if the item already exists in the cart
      itemExists = cartItems.some((cartItem) => cartItem.id === objectItem.id);
    }

    // if the item does not exist, add it to the cart
    if (!itemExists) {
      updateCartItems([...cartItems, objectItem]);
    }
  }

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCartItems(newCart);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                cartItems={cartItems}
                items={items}
                handleAddToCart={handleAddToCart}
                isLogged={isLoggedIn}
                handleLogOut={handleLogIn}
                userIdLogged={userIdLogged}
                fetchAgain={handleSpecificItem}
                handleDeleteItem={handleDeleteItem}
                setNavigateItem={setNavigateItem}
                setSearchItems={setSearchItems}
                searchItemsArray={searchItemsArray}
              />
            }
          />
          <Route
            path="/about"
            element={
              <About
                handleLogOut={handleLogIn}
                cartItems={cartItems}
                isLogged={isLoggedIn}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                isLogged={isLoggedIn}
                handleLogOut={handleLogIn}
              />
            }
          />
          <Route
            path="/Signup"
            element={<Signup setLogin={handleLogIn} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setLogin={handleLogIn} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/AddItem"
            element={
              <AddItem
                items={items}
                updateArrayItems={handleAddItemUpdate}
                userIdLogged={userIdLogged}
              />
            }
          />
          {/* when clicking on the item from our DB */}
          <Route
            path={`/item${navigateItem._id}`}
            element={
              <ItemClicked
                item={navigateItem}
                addToCart={handleAddToCart}
                isLogged={isLoggedIn}
                handleLogOut={handleLogIn}
                cartItems={cartItems}
              />
            }
          />
          {/* when clicking on item from our API */}
          <Route
            path={`/item${navigateItem.id}`}
            element={
              <ItemClicked
                item={navigateItem}
                addToCart={handleAddToCart}
                isLogged={isLoggedIn}
                handleLogOut={handleLogIn}
                cartItems={cartItems}
              />
            }
          />
          <Route
            path={"/userPanel"}
            element={
              <UserPanel
                items={items}
                userIdLogged={userIdLogged}
                isLogged={isLoggedIn}
                handleLogOut={handleLogIn}
                cartItems={cartItems}
              />
            }
          />
        </Routes>
      </Router>
      {/* <div className="App">
        <NavBar setSearchItems={setSearchItems} items={items} />
        <main id="main" className="flexbox-col"></main>
      </div> */}
    </>
  );
}
export default App;
