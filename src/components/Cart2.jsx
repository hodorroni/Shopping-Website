import React, { useState } from "react";
export default function Cart2({ cartItem, removeFromCart, handleTotalPay }) {
  const [amount, setAmount] = useState(1);

  function handleDecreaseCart(price) {
    if (amount > 1) {
      setAmount((value) => value - 1);
      handleTotalPay(price, false, true);
    }
  }

  function handleAddToCart(price) {
    setAmount((value) => value + 1);
    handleTotalPay(price, true, false);
  }

  const formatPrice = (price) => {
    const numberPrice = parseFloat(price); // Convert to number if it's a string
    if (isNaN(numberPrice)) {
      return "N/A"; // Handle cases where the price is not a valid number
    }
    return numberPrice.toFixed(2); // Format to 2 decimal places
  };
  return (
    <>
      <div className="cart-item" key={cartItem.id}>
        <div className="cart-product">
          <img src={cartItem.image} alt={cartItem.title} />
          <div>
            <h3>{cartItem.title}</h3>
            <button onClick={() => removeFromCart(cartItem)}>Remove</button>
          </div>
        </div>
        <div className="cart-product-price">{formatPrice(cartItem.price)}₪</div>
        <div className="cart-product-quantity">
          <button onClick={() => handleDecreaseCart(cartItem.price)}>-</button>
          <div className="count">{amount}</div>
          <button onClick={() => handleAddToCart(cartItem.price)}>+</button>
        </div>
        <div className="cart-product-total-price">
          ${formatPrice(cartItem.price * amount)}
        </div>
      </div>
    </>
  );
}
