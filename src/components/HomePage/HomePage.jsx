import Items from "../Items.jsx";
import Header from "../Header.jsx";
import NavBar from "../NavBar.jsx";
export default function HomePage({
  cartItems,
  items,
  handleAddToCart,
  isLogged,
  handleLogOut,
  userIdLogged,
  fetchAgain,
  handleDeleteItem,
  setNavigateItem,
  setSearchItems,
  searchItemsArray,
}) {
  return (
    <>
      <NavBar setSearchItems={setSearchItems} items={items} />
      <Header
        amountCart={cartItems.length}
        isLogged={isLogged}
        handleLogOut={() => handleLogOut(null, false)}
      />

      <Items
        items={items}
        addToCart={handleAddToCart}
        isLogged={isLogged}
        userIdLogged={userIdLogged}
        fetchAgain={fetchAgain}
        handleDeleteItem={handleDeleteItem}
        setNavigateItem={setNavigateItem}
        searchItemsArray={searchItemsArray}
      />
    </>
  );
}
