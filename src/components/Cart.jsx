import React, { useState, useEffect } from "react";
import "./Cart.css"; // Import the CSS file
import Cart2 from "./Cart2.jsx";
import Header from "./Header.jsx";
import AnimatedCanvas from "./AnimatedCanvas.jsx";
const Cart = ({ cartItems, removeFromCart, isLogged, handleLogOut }) => {
  const [totalToPay, setTotal] = useState(0);

  function handleTotalPay(price, increase, decrease) {
    if (increase) {
      setTotal((prev) => prev + price);
    }
    if (decrease) {
      setTotal((prev) => prev - price);
    }
  }

  function calculateInitialPrice() {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    setTotal(total);
  }
  // Use useEffect to calculate initial total price on mount or when cartItems change
  useEffect(() => {
    calculateInitialPrice();
  }, [cartItems]);

  const formatPrice = (price) => {
    const numberPrice = parseFloat(price); // Convert to number if it's a string
    if (isNaN(numberPrice)) {
      return "N/A"; // Handle cases where the price is not a valid number
    }
    return numberPrice.toFixed(2); // Format to 2 decimal places
  };

  return (
    <>
      <Header
        amountCart={cartItems.length}
        isLogged={isLogged}
        handleLogOut={() => handleLogOut(null, false)}
      />

      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem, index) => (
            <Cart2
              key={index}
              cartItem={cartItem}
              removeFromCart={() => removeFromCart(index)}
              handleTotalPay={handleTotalPay}
            />
          ))
        ) : (
          <h1 className="cart-empty">Your shopping cart is empty!</h1>
        )}
      </div>
      {totalToPay != 0 && (
        <>
          <h1>Total to pay: {formatPrice(totalToPay)}₪</h1>
        </>
      )}

      <AnimatedCanvas />
    </>
  );
};

export default Cart;
