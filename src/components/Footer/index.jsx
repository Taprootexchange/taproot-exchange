import "./index.scss";
import telegram from "@/imgs/telegram.svg";
import twitter from "@/imgs/twitter.svg";
import gitbook from "@/imgs/gitbook.svg";
import disclaimer from "@/imgs/disclaimer.svg";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";

export default function Footer() {
  const location = useLocation();
  const [bgColor, setBgColor] = useState("");
  useEffect(() => {
    if (location.pathname.indexOf("marketplace") != -1) {
      setBgColor("#fff");
    } else {
      setBgColor("");
    }
  }, [location.pathname]);

  let [isDisclaimer, setIsDisclaimer] = useState(false);

  return (
    <>
      <div className="footer" style={{ backgroundColor: bgColor }}>
        <div className="related-links">
          <a target="_blank" href="https://t.me/TaprootExchange">
            <img src={telegram} alt="" />
          </a>
          <a target="_blank" href="https://twitter.com/TaprootExchange">
            <img src={twitter} alt="" />
          </a>
          <a target="_blank" href="https://docs.taproot.exchange/">
            <img src={gitbook} alt="" />
          </a>
          <a
            target="_blank"
            onClick={() => {
              setIsDisclaimer(true);
            }}
          >
            <img src={disclaimer} alt="" />
          </a>
        </div>
        <div className="patent">
          {" "}
          © 2023 Taproot.Exchange. All Rights Reserved
        </div>
      </div>
      <Disclaimer
        isDisclaimer={isDisclaimer}
        setIsDisclaimer={setIsDisclaimer}
      />
    </>
  );
}
