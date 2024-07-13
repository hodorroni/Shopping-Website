import { useState } from "react";
import "./EditItemPopup.css";
export default function EditItemPopup({ item, fetchAgain, closeDialog }) {
  const [titleValue, setTitle] = useState(item.title);
  const [priceValue, setPrice] = useState(item.price);
  const [categoryValue, setCategory] = useState(item.category);
  const [descriptionValue, setDescription] = useState(item.description);
  const [imageValue, setImage] = useState(item.image);
  const [errorMessage, setError] = useState(null);

  function handleTitle(event) {
    setTitle(event.target.value);
  }
  function handlePrice(event) {
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

  function closingDialog() {
    closeDialog(false);
  }

  function handleSumbit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    //the three dots is the spread operator -> gets the key:values pairs and then im overriding the editted once
    const updatedItem = {
      ...item, // Spread the existing item
      title: titleValue, // Overwrite the values with new ones
      price: priceValue,
      category: categoryValue,
      description: descriptionValue,
      image: imageValue,
    };
    fetch("http://localhost:5000/edit-item", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: updatedItem,
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
        //close the current dialog if the user finished editting and pressen on the edit button
        closeDialog();
        setError(null);
        //Update the items array with the specific item -> the update occures in the app.jsx
        fetchAgain(updatedItem);
      })
      .catch((error) => {
        // Handle errors here
        setError(error.message);
      });
  }
  return (
    <>
      <div
        className="popped-edit-form"
        style={{
          position: "fixed",
          top: `10%`,
          left: `50%`,
          backgroundColor: "white",
          border: "1px solid black",
          padding: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        {!errorMessage && (
          <form id="form-editItem" onSubmit={(event) => handleSumbit(event)}>
            <h3>Edit Item</h3>
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
                type="text"
                id="price"
                name="price"
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
            <div className="buttons-edit">
              <button id="login-button" type="submit">
                Edit Item
              </button>
              <button id="login-button" onClick={closingDialog}>
                Cancel
              </button>
            </div>
          </form>
        )}
        {errorMessage && (
          <p>
            <h2 className="error-login">{errorMessage}</h2>
          </p>
        )}
      </div>
    </>
  );
}
