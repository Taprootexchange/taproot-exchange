import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";

export function HeaderLink({ className, exact, to, children, comingSoon }) {
  const handleClick = (event) => {
    if (comingSoon) {
      event.preventDefault();
      window.$message.open({
        type: "warning",
        content: "Coming Soon",
      });
    }
  };

  return (
    <NavLink className={className} exact={exact} to={to} onClick={handleClick}>
      {children}
    </NavLink>
  );
}
