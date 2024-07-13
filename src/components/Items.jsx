import "./Items.css";
import { useNavigate } from "react-router-dom";
import SingleItemList from "./SingleItemList";
export default function Items({
  items,
  addToCart,
  isLogged,
  userIdLogged,
  fetchAgain,
  handleDeleteItem,
  setNavigateItem,
  searchItemsArray,
}) {
  const navigate = useNavigate();
  function handleAddItems() {
    navigate("/addItem");
  }

  return (
    <>
      <section id="items">
        <div className="items">
          {/* if the length is bigger than 0 then we searched for something */}
          {/* the important part is the check for being null, we apply null in the Navbar component when we haven't searched for anything */}
          {searchItemsArray.length > 0 &&
            searchItemsArray[0] !== "null" &&
            searchItemsArray.map((value, key) => (
              <SingleItemList
                value={value}
                addToCart={addToCart}
                key={key}
                isLogged={isLogged}
                userIdLogged={userIdLogged}
                fetchAgain={fetchAgain}
                handleDeletion={handleDeleteItem}
                setNavigateItem={setNavigateItem}
              />
            ))}
          {/* if the length is 0 we didnt search anything -> show the default items */}
          {/* then we are mapping the items array -> the api items and mongodb items as default */}
          {searchItemsArray.length === 0 &&
            items.map((value, key) => (
              <SingleItemList
                value={value}
                addToCart={addToCart}
                key={key}
                isLogged={isLogged}
                userIdLogged={userIdLogged}
                fetchAgain={fetchAgain}
                handleDeletion={handleDeleteItem}
                setNavigateItem={setNavigateItem}
              />
            ))}

          {searchItemsArray[0] === "null" && (
            <p className="emptySearchMessage" style={{ color: "black" }}>
              No items to Show!
            </p>
          )}
        </div>
      </section>
      {isLogged && (
        <button className="btn-add-items" onClick={handleAddItems}>
          Add items
        </button>
      )}
    </>
  );
}
