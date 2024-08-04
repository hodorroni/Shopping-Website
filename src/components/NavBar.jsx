import React from "react";
import "./NavBar.css"; // Import your CSS file
import { useState } from "react";
const NavBar = ({ setSearchItems, items }) => {
  const [showSublist, setShowSublist] = useState(false);
  const [showInputText, setShowInputText] = useState(false);
  // const [showPrice, setShowPrice] = useState(false);
  const [selectedRadio, setRadio] = useState("");
  const [selectedPriceRadio, setSelectedPrice] = useState("");
  const [searchByItem, setSearchItem] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);

  //If hovering on the price section then show the sliders otherwise set it to false => meaning the mouse isnt on it
  const handlePriceShow = () => {
    setShowPrice(true);
  };

  const handlePriceDisable = () => {
    setShowPrice(false);
  };

  //handle the Minprice slider
  const handleMinPriceChange = (event) => {
    const value = Number(event.target.value);
    const searchedText = searchByItem.toLowerCase();
    const categoryLower = selectedRadio.toLowerCase();
    if (value <= maxPrice) {
      setMinPrice(value);
    } else {
      setMinPrice(maxPrice);
    }
    if (value <= maxPrice) {
      //if none of them has selected and we only use the slider then show items based only on the price range
      if (!categoryLower && !searchedText) {
        const minPriceArr = items.filter(
          (item) => item.price >= value && item.price <= maxPrice
        );
        if (minPriceArr.length === 0) {
          minPriceArr[0] = "null";
        }
        setSearchItems(minPriceArr);
      } else {
        let searchTitleArr = [];
        let categoriesArr = [];
        if (searchedText) {
          if (categoryLower) {
            searchTitleArr = items.filter(
              (item) =>
                item.title.toLowerCase().includes(searchedText) &&
                item.price >= value &&
                item.price <= maxPrice &&
                item.category.includes(categoryLower)
            );
          }
          //if there is no category but only title to search for
          else {
            searchTitleArr = items.filter(
              (item) =>
                item.title.toLowerCase().includes(searchedText) &&
                item.price >= value &&
                item.price <= maxPrice
            );
          }
        }

        if (categoryLower) {
          if (searchedText) {
            categoriesArr = items.filter(
              (item) =>
                item.category.toLowerCase().includes(categoryLower) &&
                item.price >= value &&
                item.price <= maxPrice &&
                item.title.toLowerCase().includes(searchedText)
            );
          }
          //only category was selected and no searchedText
          else {
            categoriesArr = items.filter(
              (item) =>
                item.category.toLowerCase().includes(categoryLower) &&
                item.price >= value &&
                item.price <= maxPrice
            );
          }
        }
        const combinedArray = Array.from(
          new Set(searchTitleArr.concat(categoriesArr))
        );
        //if we didnt find anything we make a flag and handling it in the Items.jsx file
        if (combinedArray.length === 0) {
          combinedArray[0] = "null";
        }
        setSearchItems(combinedArray);
      }
    }
  };

  //handle the Maxprice slider
  const handleMaxPriceChange = (event) => {
    const value = Number(event.target.value);
    const searchedText = searchByItem.toLowerCase();
    const categoryLower = selectedRadio.toLowerCase();
    if (value >= minPrice) {
      if (value === 0) {
        setMaxPrice(3);
      } else {
        setMaxPrice(value);
      }
    } else {
      setMaxPrice(minPrice);
    }
    if (value >= minPrice) {
      //if none of them has selected and we only use the slider then show items based only on the price range
      if (!categoryLower && !searchedText) {
        const minPriceArr = items.filter(
          (item) => item.price >= minPrice && item.price <= value
        );
        if (minPriceArr.length === 0) {
          minPriceArr[0] = "null";
        }
        setSearchItems(minPriceArr);
      } else {
        let searchTitleArr = [];
        let categoriesArr = [];
        if (searchedText) {
          if (categoryLower) {
            searchTitleArr = items.filter(
              (item) =>
                item.title.toLowerCase().includes(searchedText) &&
                item.price >= minPrice &&
                item.price <= value &&
                item.category.includes(categoryLower)
            );
          }
          //if there is no category but only title to search for
          else {
            searchTitleArr = items.filter(
              (item) =>
                item.title.toLowerCase().includes(searchedText) &&
                item.price >= minPrice &&
                item.price <= value
            );
          }
        }

        if (categoryLower) {
          if (searchedText) {
            categoriesArr = items.filter(
              (item) =>
                item.category.toLowerCase().includes(categoryLower) &&
                item.price >= minPrice &&
                item.price <= value &&
                item.title.toLowerCase().includes(searchedText)
            );
          }
          //only category was selected and no searchedText
          else {
            categoriesArr = items.filter(
              (item) =>
                item.category.toLowerCase().includes(categoryLower) &&
                item.price >= minPrice &&
                item.price <= value
            );
          }
        }
        const combinedArray = Array.from(
          new Set(searchTitleArr.concat(categoriesArr))
        );
        //if we didnt find anything we make a flag and handling it in the Items.jsx file
        if (combinedArray.length === 0) {
          combinedArray[0] = "null";
        }
        setSearchItems(combinedArray);
      }
    }
  };

  //handling category pop up
  const handleMouseEnter = () => {
    setShowSublist(true);
  };
  //handling category pop up
  const handleMouseLeave = () => {
    setShowSublist(false);
  };
  //handling text pop up
  function handleInputShow() {
    setShowInputText(true);
  }
  //handling text pop up
  function handleinputDisable() {
    setShowInputText(false);
  }

  //handle categories radio
  function handleRadio(event) {
    const category = event.target.value;
    let searchedArray = [];
    //update which radio of the categories was chosen if we click on it again change it to null
    setRadio((prevValue) => (prevValue === category ? "" : category));

    //we clicked to disable that radio button and we didnt search anything
    if (category === selectedRadio && !searchByItem) {
      searchedArray = items.filter(
        (value) => value.price >= minPrice && value.price <= maxPrice
      );
    }
    //disabling the radio button but user searched something
    else if (category === selectedRadio && searchByItem) {
      searchedArray = items.filter(
        (value) =>
          value.title.toLowerCase().includes(searchByItem) &&
          value.price >= minPrice &&
          value.price <= maxPrice
      );
    }
    //the category radio wasnt disabled from turned on to off meaning we chose different category
    else {
      if (searchByItem) {
        searchedArray = items.filter(
          (value) =>
            value.category.toLowerCase().includes(category) &&
            value.title.toLowerCase().includes(searchByItem) &&
            value.price >= minPrice &&
            value.price <= maxPrice
        );
      }
      //we didnt enter any text so we dont search by the title only by the category and price
      else {
        searchedArray = items.filter(
          (value) =>
            value.category.toLowerCase().includes(category) &&
            value.price >= minPrice &&
            value.price <= maxPrice
        );
      }
    }
    if (searchedArray.length === 0) {
      searchedArray[0] = "null";
    }
    setSearchItems(searchedArray);
  }

  //handling the search by the title of the items
  function handleTextChange(event) {
    const searchedText = event.target.value.toLowerCase();
    let titleArray = [];
    setSearchItem(searchedText);
    //if the user deleted what he has searched but has category selected
    if (searchedText === "" && selectedRadio) {
      titleArray = items.filter(
        (item) =>
          item.category.toLowerCase().includes(selectedRadio) &&
          item.title.toLowerCase().includes(searchedText) &&
          item.price >= minPrice &&
          item.price <= maxPrice
      );
    }
    //the user deleted what he has searched and also no radio
    else if (searchedText === "" && selectedRadio === "") {
      titleArray = items.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );
    }
    //the user searched for something
    else {
      //user selected category too
      if (selectedRadio) {
        titleArray = items.filter(
          (item) =>
            item.category.toLowerCase().includes(selectedRadio) &&
            item.title.toLowerCase().includes(searchedText) &&
            item.price >= minPrice &&
            item.price <= maxPrice
        );
      }
      //searching only by the user title
      else {
        titleArray = items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchedText) &&
            item.price >= minPrice &&
            item.price <= maxPrice
        );
      }

      //if we didnt find anything we make a flag and handling it in the Items.jsx file
      if (titleArray.length === 0) {
        titleArray[0] = "null";
      }
      setSearchItems(titleArray);
    }
  }

  //handle clear all and show the default items in the website
  function handleClearAll() {
    setSearchItem("");
    setMaxPrice(1500);
    setMinPrice(0);
    setRadio("");
    setSearchItems([]);
  }

  return (
    <nav id="navbar">
      <ul className="navbar-items flexbox-col">
        <li className="navbar-logo flexbox-left">
          <a className="navbar-item-inner flexbox">
            <svg viewBox="0 0 100 80" width="40" height="40">
              <rect width="100" height="20"></rect>
              <rect y="30" width="100" height="20"></rect>
              <rect y="60" width="100" height="20"></rect>
            </svg>
          </a>
        </li>

        {/* search by title */}
        <li className="navbar-item flexbox-left">
          <a className="navbar-item-inner flexbox-left">
            <div className="navbar-item-inner-icon-wrapper flexbox">
              <ion-icon name="search-outline"></ion-icon>
            </div>
            <span
              className="link-text"
              onMouseEnter={handleInputShow}
              onMouseLeave={handleinputDisable}
            >
              Search
              {showInputText && (
                <ul className="nav-link-ul">
                  <li>
                    <input
                      className="searchNavbarText"
                      type="text"
                      value={searchByItem}
                      onChange={handleTextChange}
                    />
                  </li>
                </ul>
              )}
            </span>
          </a>
        </li>

        {/* Categories radio buttons */}
        <li className="navbar-item flexbox-left">
          <a className="navbar-item-inner flexbox-left">
            <div className="navbar-item-inner-icon-wrapper flexbox">
              <ion-icon name="folder-open-outline"></ion-icon>
            </div>
            <span
              className="link-text"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Categories
              {showSublist && (
                <ul className="nav-link-ul">
                  <li>
                    <div className="navbar-categories">
                      <input
                        type="radio"
                        id="electronics"
                        name="fav_language"
                        value="electronics"
                        className="radio-electronics"
                        onClick={handleRadio}
                        checked={selectedRadio === "electronics"}
                      />
                      <label className="electronics-label" for="html">
                        electronics
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="navbar-categories">
                      <input
                        type="radio"
                        id="jewelery"
                        name="fav_language"
                        value="jewelery"
                        className="radio-electronics"
                        onClick={handleRadio}
                        checked={selectedRadio === "jewelery"}
                      />
                      <label className="electronics-label" for="html">
                        jewelery
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="navbar-categories">
                      <input
                        type="radio"
                        id="clothing"
                        name="fav_language"
                        value="clothing"
                        className="radio-electronics"
                        onClick={handleRadio}
                        checked={selectedRadio === "clothing"}
                      />
                      <label className="electronics-label" for="html">
                        clothing
                      </label>
                    </div>
                  </li>
                </ul>
              )}
            </span>
          </a>
        </li>

        {/* Price slider range */}
        <li className="navbar-item flexbox-left">
          <a className="navbar-item-inner flexbox-left">
            <div className="navbar-item-inner-icon-wrapper flexbox">
              <ion-icon name="pie-chart-outline"></ion-icon>
            </div>
            <span
              className="link-text"
              onMouseEnter={handlePriceShow}
              onMouseLeave={handlePriceDisable}
            >
              Sort by price
              {showPrice && (
                <ul className="nav-link-ul">
                  <li>
                    <div className="navbar-slider">
                      <label className="electronics-label" htmlFor="minPrice">
                        Min Price: {minPrice}
                      </label>
                      <input
                        type="range"
                        id="minPrice"
                        name="minPrice"
                        min="0"
                        max="1400"
                        step="1"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="navbar-slider">
                      <label className="electronics-label" htmlFor="maxPrice">
                        Max Price: {maxPrice}
                      </label>
                      <input
                        type="range"
                        id="maxPrice"
                        name="maxPrice"
                        min="0"
                        max="1400"
                        step="1"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                      />
                    </div>
                    <p>
                      {minPrice}₪ - {maxPrice}₪
                    </p>
                  </li>
                </ul>
              )}
            </span>
          </a>
        </li>
        <li onClick={handleClearAll} className="navbar-item flexbox-left">
          <a className="navbar-item-inner flexbox-left">
            <div className="navbar-item-inner-icon-wrapper flexbox">
              <ion-icon name="pie-chart-outline"></ion-icon>
            </div>
            <span className="link-text">Clear All</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
