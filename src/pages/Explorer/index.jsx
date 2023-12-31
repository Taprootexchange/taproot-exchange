import "./index.scss";
import Menu from "@/components/Common/Menu";
import { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";

function getItem(label, key) {
  return {
    label,
    key,
  };
}

export default function Explorer() {
  const titleItems = useMemo(() => {
    return [
      getItem(<Link to="token-events">Token Events</Link>, "token-events"),
      getItem(<Link to="market-events">Market Events</Link>, "market-events"),
    ];
  });

  return (
    <div className="explorer">
      <Menu items={titleItems} />
      <div className="content-box">
        <Outlet />
      </div>
    </div>
  );
}
