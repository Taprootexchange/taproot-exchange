import "./index.scss";
import Menu from "@/components/Common/Menu";
import { useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Disclaimer from "@/components/Disclaimer";
import { useEffect } from "react";

function getItem(label, key) {
  return {
    label,
    key,
  };
}

export default function Marketplace() {
  const titleItems = useMemo(() => {
    return [
      getItem(<Link to="favorites">Favorites</Link>, "favorites"),
      getItem(<Link to="hot">Hot</Link>, "hot"),
    ];
  });

  let init = localStorage.getItem("init");
  let [isDisclaimer, setIsDisclaimer] = useState(false);
  useEffect(() => {
    if (!init) {
      setIsDisclaimer(true);
    }
  }, []);

  return (
    <>
      <div className="bgc-box">
        <div className="marketplace">
          <div className="title-box">
            <p>
              Taproot Exchange Is Bitcoin Native Assets LaunchPad, Supported by
              TaprootAssets Protocol, Driven by Multi-Chain Technology.
            </p>
          </div>
          <div className="content">
            <div className="title">
              TAP-20 Token Listing On Taproot Exchange
            </div>
            <Menu items={titleItems} />
            <Outlet />
          </div>
        </div>
      </div>

      <Disclaimer
        isDisclaimer={isDisclaimer}
        setIsDisclaimer={setIsDisclaimer}
      />
    </>
  );
}
