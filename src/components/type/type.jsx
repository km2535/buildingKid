import React, { useState } from "react";
import style from "./type.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
const Type = ({ typeHandle }) => {
  const [option, setOption] = useState(false);
  const typemethodHandler = (e) => {
    typeHandle(e);
  };
  const optionView = () => {
    setOption(!option);
  };
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <h2>지도 옵션 설정하기</h2>
        <FontAwesomeIcon
          className={option ? style.icon : style.iconReverse}
          icon={faAngleDown}
          onClick={optionView}
        />
      </div>
      <div className={option ? style.optionContainer : style.optionHidden}>
        <div className={style.content}>
          <ul className={style.ul}>
            <li className={style.li}>
              <label>
                <input
                  type={"checkbox"}
                  id={"district"}
                  onClick={typemethodHandler}
                />
                지적편집도 정보 보기
              </label>
            </li>
            <li className={style.li}>
              <label>
                <input
                  type={"checkbox"}
                  id={"terrain"}
                  onClick={typemethodHandler}
                />
                지형정보 보기
              </label>
            </li>
            <li className={style.li}>
              <label>
                <input
                  type={"checkbox"}
                  id={"traffic"}
                  onClick={typemethodHandler}
                />
                교통정보 보기
              </label>
            </li>
            <li className={style.li}>
              <label>
                <input
                  type={"checkbox"}
                  id={"bicycle"}
                  onClick={typemethodHandler}
                />
                자전거도로 정보 보기
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Type;
