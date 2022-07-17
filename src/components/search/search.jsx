import React, { useRef, useState } from "react";
import style from "./search.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = ({ setSearch }) => {
  const [text, setText] = useState(null);
  const ref = useRef();
  const changeHandler = () => {
    //console.log(ref.current.value);
    setText(ref.current.value);
  };
  const searchHandler = () => {
    setSearch(text);
  };
  return (
    <>
      <div className={style.container}>
        <img className={style.img} src="./images/logo.png" alt="" />
        <input
          className={style.input}
          type="text"
          placeholder="장소, 주소 검색"
          onChange={changeHandler}
          ref={ref}
        ></input>
        <button className={style.button}>
          <FontAwesomeIcon
            className={style.icon}
            icon={faMagnifyingGlass}
            onClick={searchHandler}
          />
        </button>
      </div>
    </>
  );
};

export default Search;
