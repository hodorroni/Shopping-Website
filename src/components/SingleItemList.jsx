import { useState } from "react";
import EditItemPopup from "./EditItemPopup";
import { useNavigate } from "react-router-dom";
export default function SingleItemList({
  value,
  addToCart,
  isLogged,
  userIdLogged,
  handleDeletion,
  fetchAgain,
  setNavigateItem,
}) {
  const [errorMessage, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const formatPrice = (price) => {
    const numberPrice = parseFloat(price); // Convert to number if it's a string
    if (isNaN(numberPrice)) {
      return "N/A"; // Handle cases where the price is not a valid number
    }
    return numberPrice.toFixed(2); // Format to 2 decimal places
  };
  const navigate = useNavigate();

  function editIconClicked() {
    setIsOpen((prevValue) => !prevValue);
  }

  function handleBuyNow(item) {
    addToCart(item);
    navigate("/cart");
  }

  function handleItemClick(item) {
    if (item.id) {
      fetch(`http://localhost:5000/item/${item.id}`)
        .then((response) => response.json())
        .then((data) => {
          //Update the navigate parameter in the APP.jsx to know where we should navigate to
          setNavigateItem(data);
          navigate(`/item${item.id}`);
        })
        .catch((error) => console.error("Error:", error));
    } else if (item._id) {
      fetch(`http://localhost:5000/itemDB/${item._id}`)
        .then((response) => response.json())
        .then((data) => {
          // handle the data received from the backend
          setNavigateItem(data);
          navigate(`/item${item._id}`);
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  //Handling a deletion of an item
  function handleDeleteItem(item) {
    fetch("http://localhost:5000/delete-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: item,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, parse the JSON to get the error message
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Unknown error");
          });
        }
        return response.json();
      })
      .then((data) => {
        //Fetch again the items from the api and from the db to update the UI
        handleDeletion(item);
      })
      .catch((error) => {
        // Handle errors here
        setError(error.message);
      });
  }
  return (
    <>
      <div className="item">
        <div className="wrapper">
          <div className="item-image-delete">
            <a>
              <img
                className="item-image-card"
                onClick={() => handleItemClick(value)}
                src={value.image}
                alt={value.category}
              />
            </a>
            {value.userCreated === userIdLogged && (
              <>
                <button
                  className="item-deleteById"
                  onClick={() => handleDeleteItem(value)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="40"
                    height="40"
                    viewBox="0 0 64 64"
                  >
                    <ellipse
                      cx="32"
                      cy="61"
                      opacity=".7"
                      rx="19"
                      ry="3"
                    ></ellipse>
                    <path
                      fill="#9c34c2"
                      d="M43.299,55H20.701c-1.535,0-2.823-1.159-2.984-2.686L14,17h36l-3.717,35.314	C46.122,53.841,44.834,55,43.299,55z"
                    ></path>
                    <path
                      fill="#ffa1ac"
                      d="M50,22H14c-1.657,0-3-1.343-3-3v-2c0-1.657,1.343-3,3-3h36c1.657,0,3,1.343,3,3v2	C53,20.657,51.657,22,50,22z"
                    ></path>
                    <path
                      d="M43.965,26.469l-2.248,21.757C41.602,49.237,40.746,50,39.729,50H33c-2.762,0-4.997,2.239-4.997,5	h15.296c1.535,0,2.823-1.159,2.984-2.686l3.152-30.249C46.712,21.784,44.274,23.747,43.965,26.469z"
                      opacity=".15"
                    ></path>
                    <path
                      fill="#fff"
                      d="M21.111,37.65l-1.585-16.205c-0.004-0.04-0.009-0.08-0.015-0.119	C19.346,20.102,20.244,19,21.48,19h9.385c2.762,0,4.997-2.239,4.997-5H14c-1.657,0-3,1.343-3,3v2c0,1.657,1.343,3,3,3h0.558	l2.139,21.174C19.441,42.868,21.418,40.395,21.111,37.65z"
                      opacity=".3"
                    ></path>
                    <line
                      x1="17.5"
                      x2="23.5"
                      y1="17.5"
                      y2="17.5"
                      fill="none"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="3"
                    ></line>
                    <path
                      fill="#9c34c2"
                      d="M39,14H25v-2c0-1.657,1.343-3,3-3h8c1.657,0,3,1.343,3,3V14z"
                    ></path>
                  </svg>
                </button>
                <button className="edit-button-item" onClick={editIconClicked}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="40"
                    height="40"
                    viewBox="0 0 64 64"
                  >
                    <path
                      fill="#ed7899"
                      d="M50.858,5.859l6.809,6.809c1.562,1.562,1.562,4.095,0,5.657l-3.663,3.663l0,0L41.538,9.522l0,0 l3.663-3.663C46.763,4.297,49.296,4.297,50.858,5.859z"
                    ></path>
                    <path
                      fill="#c2cde7"
                      d="M39.124,8.878L55.126,24.88l-6.619,6.619L32.505,15.497L39.124,8.878z"
                    ></path>
                    <path
                      fill="#f9e3ae"
                      d="M34.127,16.874l12.997,12.997L18.5,58.495L5.503,45.498L34.127,16.874z"
                    ></path>
                    <path
                      fill="#f6d397"
                      d="M42.626,25.375l4.497,4.497L18.5,58.496l-4.497-4.497L42.626,25.375z"
                    ></path>
                    <path
                      fill="#faefde"
                      d="M5,57l1-11l7,1l1,3l2.92,1.5L19,59H7L5,57z"
                    ></path>
                    <path
                      fill="#faefde"
                      d="M34.126,16.874l4.497,4.497L10,49.995l-4.497-4.497L34.126,16.874z"
                    ></path>
                    <path
                      fill="#8d6c9f"
                      d="M60.59,15.9c0.001-1.061-0.42-2.079-1.17-2.83l-8.49-8.48c-1.582-1.516-4.078-1.516-5.66,0L41,8.83 c-0.781-0.781-2.047-0.782-2.828-0.002c-0.001,0.001-0.001,0.001-0.002,0.002l-5.66,5.66c-0.781,0.781-0.782,2.047-0.002,2.828 c0.001,0.001,0.001,0.001,0.002,0.002l0.05,0.05L5.52,44.4c-0.504,0.503-0.812,1.17-0.87,1.88L4,54.68L3.3,59.6 c-0.077,0.547,0.303,1.053,0.85,1.13c0.05,0.007,0.1,0.01,0.15,0.01h0.1L9.32,60l8.45-0.62c0.717-0.053,1.391-0.362,1.9-0.87 l27.08-27c0.774,0.743,1.996,0.743,2.77,0l5.66-5.66c0.781-0.781,0.782-2.047,0.002-2.828c-0.001-0.001-0.001-0.001-0.002-0.002 l4.24-4.24C60.182,18.017,60.604,16.978,60.59,15.9z M11.9,47.9l0.58,2.88c0.08,0.393,0.387,0.7,0.78,0.78l2.88,0.58l1.07,5.34 L9.59,58L6,54.41l0.61-7.6L11.9,47.9z M19,56.35l-1-4.77L34.67,35c0.359-0.419,0.31-1.051-0.109-1.41 c-0.374-0.321-0.927-0.321-1.301,0l-16.6,16.58L14.3,49.7l-0.47-2.36l13.76-13.76c0.359-0.419,0.31-1.051-0.109-1.41 c-0.374-0.321-0.927-0.321-1.301,0L12.42,45.93L7.75,45L34,18.78l11.32,11.31L19,56.35z M52.34,25.8L52.34,25.8 c-0.39-0.388-1.02-0.388-1.41,0l-1.41,1.41c-0.388,0.39-0.388,1.02,0,1.41l0,0L48.1,30l0,0L34,15.9l1.41-1.41 c0.39,0.388,1.02,0.388,1.41,0l1.41-1.41c0.388-0.39,0.388-1.02,0-1.41l1.41-1.41l0.71,0.71l12.7,12.71l0.71,0.71L52.34,25.8z M58,17.31l-4.24,4.24L42.44,10.24L46.69,6c0.781-0.781,2.047-0.782,2.828-0.002C49.519,5.999,49.519,5.999,49.52,6L58,14.49 c0.781,0.781,0.782,2.047,0.002,2.828c-0.001,0.001-0.001,0.001-0.002,0.002V17.31z"
                    ></path>
                    <path
                      fill="#8d6c9f"
                      d="M40.32,15.19l-1.41,1.41c-0.431,0.345-0.501,0.974-0.156,1.406c0.345,0.431,0.974,0.501,1.406,0.156 c0.059-0.048,0.113-0.102,0.161-0.162l1.41-1.41c0.359-0.419,0.31-1.051-0.109-1.41c-0.374-0.321-0.927-0.321-1.301,0V15.19z M43.86,18.73l-1.41,1.41c-0.419,0.359-0.468,0.991-0.109,1.41s0.991,0.468,1.41,0.109c0.039-0.033,0.076-0.07,0.109-0.109 l1.41-1.41c0.359-0.419,0.31-1.051-0.109-1.41C44.787,18.409,44.234,18.409,43.86,18.73z M47.39,22.26L46,23.68 c-0.419,0.359-0.468,0.991-0.109,1.41s0.991,0.468,1.41,0.109c0.039-0.033,0.076-0.07,0.109-0.109l1.41-1.41 c0.359-0.419,0.31-1.051-0.109-1.41c-0.374-0.321-0.927-0.321-1.301,0L47.39,22.26z M31.84,26.51L29,29.33 c-0.419,0.359-0.468,0.991-0.109,1.41c0.359,0.419,0.991,0.468,1.41,0.109c0.039-0.033,0.076-0.07,0.109-0.109l2.83-2.83 c0.359-0.419,0.31-1.051-0.109-1.41c-0.374-0.321-0.927-0.321-1.301,0L31.84,26.51z"
                    ></path>
                  </svg>
                </button>
                {/* should be a component of form that poppes when pressing the edit button with inputs in it */}
                {isOpen && (
                  <EditItemPopup
                    item={value}
                    fetchAgain={fetchAgain}
                    closeDialog={setIsOpen}
                  />
                )}
              </>
            )}
          </div>
          <h2>{value.title}</h2>
          <h3>₪ {formatPrice(value.price)}</h3>
          <div className="buttonsItem">
            <button
              onClick={() => addToCart(value)}
              className="btn-buynow outline"
            >
              Add to Cart
            </button>
            <button
              className="btn-buynow fill"
              onClick={() => handleBuyNow(value)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
