import "./ItemClicked.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
export default function ItemClicked({
  item,
  addToCart,
  cartItems,
  isLogged,
  handleLogOut,
}) {
  const navigate = useNavigate();
  function handleBuyNow(item) {
    addToCart(item);
    navigate("/cart");
  }
  return (
    <>
      <Header
        amountCart={cartItems.length}
        isLogged={isLogged}
        handleLogOut={() => handleLogOut(null, false)}
      />
      <div className="item-detail">
        <h2>{item.title}</h2>
        <img className="item-detail-image" src={item.image} alt={item.title} />
        <p>Price: {item.price}</p>
        <p>Category: {item.category}</p>
        <p>Description: {item.description}</p>
        <div className="buttonsItem">
          <button onClick={() => addToCart(item)} className="item-add-cart">
            Add to Cart
          </button>
          <button className="item-buy-cart" onClick={() => handleBuyNow(item)}>
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}
