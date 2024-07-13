import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";
export default function AddItem({ items, updateArrayItems, userIdLogged }) {
  const [titleValue, setTitle] = useState("");
  const [priceValue, setPrice] = useState(1);
  const [categoryValue, setCategory] = useState("");
  const [descriptionValue, setDescription] = useState("");
  const [imageValue, setImage] = useState("");
  const [errorMessage, setError] = useState(null);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Set body styles
    document.body.style.background = "linear-gradient(45deg, #FC466B, #3F5EFB)";
    document.body.style.height = "100vh";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Cleanup function to reset styles if the component unmounts
    return () => {
      document.body.style.background = "";
      document.body.style.height = "";
      document.body.style.fontFamily = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  //navigate to the homepage after 2sec as soon as the data is fetched from the DB
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5-second delay before navigation
    }
  }, [result, navigate]);

  function handleTitle(event) {
    setTitle(event.target.value);
  }
  function handlePrice(event) {
    // const ourNumber = Number(event.target.value);
    setPrice(event.target.value);
  }
  function handleCategory(event) {
    setCategory(event.target.value);
  }
  function handleDescription(event) {
    setDescription(event.target.value);
  }
  function handleImage(event) {
    setImage(event.target.value);
  }
  const isPriceInvalid = priceValue <= 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!isPriceInvalid) {
      fetch("http://localhost:5000/add-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCreated: userIdLogged,
          title: titleValue,
          price: Number(priceValue),
          category: categoryValue,
          description: descriptionValue,
          image: imageValue,
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
          updateArrayItems(data);
          setError(null);
        })
        .catch((error) => {
          setError("Error");
        });
    }
  }

  return (
    <>
      <div
        className="container"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      >
        <form className="form-addItem" onSubmit={handleSubmit}>
          <h3>List your item now!</h3>
          <p>
            <label htmlFor="title">title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={titleValue}
              onChange={handleTitle}
            />
          </p>

          <p>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              className={isPriceInvalid ? "error" : ""}
              style={{ borderColor: isPriceInvalid ? "red" : "" }}
              value={priceValue}
              onChange={handlePrice}
            />
          </p>
          <p>
            <label htmlFor="price">category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={categoryValue}
              onChange={handleCategory}
            />
          </p>
          <p>
            <label htmlFor="price">description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={descriptionValue}
              onChange={handleDescription}
            />
          </p>
          <p>
            <label htmlFor="price">image:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={imageValue}
              onChange={handleImage}
            />
          </p>

          {errorMessage && (
            <p>
              <h2 className="error-login">{errorMessage}</h2>
            </p>
          )}

          <button id="login-button" type="submit">
            Add Item
          </button>
        </form>

        <div class="drops">
          <div
            class="drop drop-1"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          ></div>
          <div
            class="drop drop-2"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          ></div>
          <div
            class="drop drop-3"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          ></div>
          <div
            class="drop drop-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          ></div>
          <div
            class="drop drop-5"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          ></div>
        </div>
      </div>
    </>
  );
}
