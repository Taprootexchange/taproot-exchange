import { Button, Table, Space } from "antd";
import "./index.scss";
import notLoginIcon from "@/imgs/not-login-ico.png";
import avatar from "@/imgs/avatar.png";
import { useTokenChangeQuery } from "@/hooks/graphQuery/useExplore";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import { limitDecimals, numberWithCommas } from "@/lib/numbers";
import useGetNostrAccount from "@/hooks/useGetNostrAccount";
import { useNavigate } from "react-router-dom";
import { useGetUsdPrice } from "@/hooks/useQueryBtcPrice";

function Wallet() {
  const navigate = useNavigate();
  let { getUsdPrice } = useGetUsdPrice();
  const { nostrAccount, balanceList, npubNostrAccount } = useSelector(
    ({ user }) => user
  );
  let { list, fetching, reexcuteQuery } = useTokenChangeQuery({});
  const { handleGetNostrAccount } = useGetNostrAccount();

  useEffect(() => {
    if (!npubNostrAccount || !nostrAccount) {
      handleGetNostrAccount();
    }
  }, [npubNostrAccount]);

  const handleNavigate = (record) => {
    const tokenID = record.symbol;
    if (tokenID == "SATS") return;
    navigate(`/marketplace-details/listing?token=${tokenID}`);
  };

  const columns = [
    {
      title: "Token",
      dataIndex: "symbol",
      key: "symbol",
      render: (_, record) => <span style={{ fontWeight: 600 }}>{_}</span>,
    },
    {
      title: "Assets Address",
      dataIndex: "token",
      key: "token",
      render: (text) => {
        return <EllipsisMiddle suffixCount={6}>{text}</EllipsisMiddle>;
      },
    },
    {
      title: "Floor Price",
      dataIndex: "deal_price",
      key: "lastPrice",
      render: (text, record) => {
        return (
          <span className="font-style">
            {text} ≈ {getUsdPrice(text, 4)}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "symbol",
      key: "amount",
      render: (text) => {
        const balance = balanceList?.[text]?.balanceShow;
        return balance ? numberWithCommas(balance) : "--";
      },
    },
    {
      title: "Value",
      dataIndex: "symbol",
      key: "value",
      render: (text) => {
        const balance = balanceList?.[text]?.balanceShow;
        if (balance && list) {
          let finPrice = list.find((k) => k.name == text);
          if (finPrice) {
            return `${numberWithCommas(
              Number(finPrice.deal_price) * Number(balance)
            )} ≈ ${getUsdPrice(Number(finPrice.deal_price) * Number(balance))}`;
          } else {
            return "--";
          }
        } else {
          return "--";
        }
      },
    },
    {
      title: "24h Change",
      dataIndex: "symbol",
      key: "change",
      render: (text) => {
        return "--";
      },
    },
  ];

  const totalSTAT = useMemo(() => {
    let total = 0;
    if (balanceList && list && list.length) {
      for (let key in balanceList) {
        let finPrice = list.find((k) => k.name == key);
        if (finPrice && balanceList[key].balanceShow) {
          total +=
            Number(finPrice.deal_price) * Number(balanceList[key].balanceShow);
        }
      }
    }
    return total;
  }, [balanceList, list]);

  list = list.filter((res, index) => {
    if (res.symbol != "USDT") {
      res.key = index;
      return res;
    }
  });

  return (
    <div className="wallet">
      <div className="my-assets">
        {!nostrAccount ? (
          <div className="not-login-status">
            <img src={notLoginIcon} alt="" />
            <Button className="btn" type="primary">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="login-status">
            <img className="avatar" src={avatar} alt="" />
            <div className="address">
              <div className="title">My Wallet Address</div>
              <div className="url">
                <div className="nums">
                  <EllipsisMiddle suffixCount={8}>
                    {npubNostrAccount}
                  </EllipsisMiddle>
                </div>
              </div>
            </div>
            <div className="balance">
              <div className="title">TOTAL BALANCE</div>
              <div className="nums">
                <span>
                  {numberWithCommas(totalSTAT)} SATS ≈{" "}
                  {getUsdPrice(totalSTAT, 2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="full-list-box">
        <div className="title">
          <div className="left">The Full List of Assets In My Wallet</div>
          <div className="right">
            <Button className="btn" type="primary">
              Receive
            </Button>
            <Button className="btn" type="primary">
              Send
            </Button>
            <Button className="btn" type="primary">
              Transfer
            </Button>
          </div>
        </div>

        <Table
          loading={fetching}
          columns={columns}
          size="middle"
          dataSource={list}
          onRow={(record) => {
            return {
              onClick: (e) => {
                handleNavigate(record);
              },
            };
          }}
        />
      </div>
    </div>
  );
}

export default Wallet;
