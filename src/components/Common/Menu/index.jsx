import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./index.scss";

const getKeyFromPath = (path) => {
  const parts = path.split("/");
  return parts[parts.length - 1];
};

const MenuItem = ({ label, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`title-item ${isActive ? "title-item-active" : ""}`}
  >
    {label}
  </div>
);

const Menu = ({ items }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [current, setCurrent] = useState(getKeyFromPath(currentPath));
  useEffect(() => {
    setCurrent(getKeyFromPath(location.pathname));
  }, [location.pathname]);

  const onItemClick = (item) => {
    setCurrent(item.key);
  };

  return (
    <div className="menu-box">
      {items.map((item) => (
        <MenuItem
          key={item.key}
          label={item.label}
          onClick={() => onItemClick(item)}
          isActive={current === item.key}
        />
      ))}
    </div>
  );
};

export default Menu;
