import logoIconSvg from "@/imgs/logo.svg";
import "./Header.scss";
import { HeaderLink } from "./HeaderLink";
import ConnectWalletButton from "@/components/Common/ConnectWalletButton";
import { Fragment } from "react";
import { Button, Flex, Popover, Radio, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import marketplaceIcon from "@/imgs/marketplace.svg";
import marketplaceIcon2 from "@/imgs/marketplace2.svg";
import explorerIcon from "@/imgs/explorer.svg";
import explorerIcon2 from "@/imgs/explorer2.svg";
import walletIcon from "@/imgs/wallet.svg";
import walletIcon2 from "@/imgs/wallet2.svg";
import FinanceIcon from "@/imgs/finance.svg";
import FinanceIcon2 from "@/imgs/finance2.svg";
import listingApplicationIcon from "@/imgs/listing-application.svg";
import listingApplicationIcon2 from "@/imgs/listing-application2.svg";
import { DownOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getRandomInt } from "@/lib/numbers";

const { Paragraph } = Typography;
function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const linksList = [
    {
      path: "/marketplace",
      name: "Marketplace",
      iconActive: marketplaceIcon,
      icon: marketplaceIcon2,
    },
    {
      path: "/explorer",
      name: "Explorer",
      iconActive: explorerIcon,
      icon: explorerIcon2,
    },
    {
      path: "/wallet",
      name: "Wallet",
      iconActive: walletIcon,
      icon: walletIcon2,
    },
    {
      path: "/finance",
      name: "Finance",
      iconActive: FinanceIcon,
      icon: FinanceIcon2,
      comingSoon: true,
    },
    {
      path: "/listing-application",
      name: "Listing Application",
      iconActive: listingApplicationIcon,
      icon: listingApplicationIcon2,
      comingSoon: true,
    },
  ];

  const toHome = () => {
    navigate("/");
  };

  const listContent = linksList.map((item) => (
    <Fragment key={item.path}>
      <HeaderLink
        className={`App-header-link-container`}
        to={item.path}
        comingSoon={item.comingSoon}
      >
        <img
          src={
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/")
              ? item.iconActive
              : item.icon
          }
          alt=""
        />
        <span>{item.name}</span>
      </HeaderLink>
    </Fragment>
  ));

  const content = (
    <>
      <div className="title">Relays</div>
      <div className="content">
        <p className="round"></p>
        <p className="relay-server">Relay Server</p>
        <Paragraph copyable>wss://relay.taproot.exchange</Paragraph>
      </div>

      <div className="ping">
        <span>Ping: </span>
        <span>0 ms</span>
      </div>
    </>
  );

  return (
    <>
      <header className="App-header">
        <div className="left-box">
          <img
            className="logo"
            onClick={toHome}
            src={logoIconSvg}
            alt="TaprootAssets Logo"
          />
        </div>
        <div className="center-box">{listContent}</div>
        <div className="right-box">
          <div>
            <ConnectWalletButton></ConnectWalletButton>
          </div>
          <div className="relays-box">
            <Popover className="relays" content={content} trigger="click">
              <Button className="relays-btn">
                Relays <DownOutlined />
              </Button>
            </Popover>
          </div>
        </div>
      </header>
    </>
  );
}

export default AppHeader;
