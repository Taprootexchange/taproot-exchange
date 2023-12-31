import { Button, ConfigProvider, Typography } from "antd";
import useGetNostrAccount from "@/hooks/useGetNostrAccount";
import { useSelector, useDispatch } from "react-redux";
import { initNostrAccount } from "@/store/reducer/userReducer";
import { Dropdown, Space } from "antd";
import { useCallback, useMemo } from "react";
import "./index.scss";
import { shortenAddress } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa";
import { nip19 } from "nostr-tools";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import { CopyOutlined, DisconnectOutlined } from "@ant-design/icons";

export default function ConnectWalletButton() {
  const dispatch = useDispatch();
  const handleDisconnect = () => {
    if (window.okxwallet) {
      window.okxwallet.disconnect();
    }
    dispatch(initNostrAccount(""));
    localStorage.setItem("nostrAccount", "");
  };
  const navigate = useNavigate();
  function toAccount() {
    navigate("/assets");
  }

  const items = [
    {
      label: (
        <Space onClick={copyWalletRUL}>
          <CopyOutlined />
          <span>Copy Address</span>
        </Space>
      ),
      key: "1",
    },
    {
      label: (
        <Space onClick={handleDisconnect}>
          <DisconnectOutlined />
          <span>Disconnect</span>
        </Space>
      ),
      key: "2",
    },
  ];

  const { handleGetNostrAccount } = useGetNostrAccount();
  const { nostrAccount } = useSelector(({ user }) => user);

  const handleConnectWallet = useCallback(async () => {
    const currentNostrAccount = await handleGetNostrAccount();
    if (currentNostrAccount.message) {
      window.$message.open({
        type: "error",
        content: currentNostrAccount.message,
      });
      return;
    }
    if (currentNostrAccount) {
      window.$message.open({
        type: "success",
        content: "Connect success.",
      });
    }
  });

  const npubNostrAccount = useMemo(() => {
    return nostrAccount ? nip19.npubEncode(nostrAccount) : "";
  }, [nostrAccount]);

  function copyWalletRUL() {
    copy(npubNostrAccount);
    window.$message.open({
      type: "success",
      content: "Copy success.",
    });
  }

  if (nostrAccount) {
    return (
      <div id="connect-wallet">
        <Dropdown menu={{ items }}>
          <Space>
            <Button type="primary" ghost className="connect-wallet-button">
              <span className="shortenAddress">
                {shortenAddress(npubNostrAccount, 16)}
              </span>
              <FaChevronDown />
            </Button>
          </Space>
        </Dropdown>
      </div>
    );
  } else {
    return (
      <div id="connect-wallet">
        <Button
          type="primary"
          ghost
          className="connect-wallet-button"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }
}
