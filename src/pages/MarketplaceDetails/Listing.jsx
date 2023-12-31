import { Select, Radio, Card, Button, Pagination, List, Modal } from "antd";
import { useOutletContext } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import btcIcon from "@/imgs/btc-icon.png";
import { getQueryVariable, shortenAddress } from "@/lib/utils";
import {
  useListingQuery,
  useTokenChangeQuery,
} from "@/hooks/graphQuery/useExplore";
import "./index.scss";

export default function Listing() {
  const [token, setToken] = useState(getQueryVariable("token") || "TAP2");
  const [type, setType] = useState("Buy");
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);
  const [sort, setSort] = useState("Price From Low to High");
  const { balanceList, nostrAccount } = useSelector(({ user }) => user);
  const [allowance, setAllowance] = useState({});

  let { tokenList } = useTokenChangeQuery({});
  const [currentTokenInfo, setCurrentTokenInfo] = useOutletContext();
  const [btnLoading, setBtnLoading] = useState(false);
  let [newList, setNewList] = useState([]);
  const { list, total, fetching, reexcuteQuery } = useListingQuery({
    pageSize: pageSize,
    pageIndex: pageIndex,
    type,
    token,
    sort,
  });

  useEffect(() => {
    if (list && Array.isArray(list) && list.length) {
      setNewList(list);
    }
  }, [list]);
  const getTokenList = useCallback(() => {
    if (tokenList?.length) {
      let filter =
        tokenList.filter(
          (tokenItem) => tokenItem.name !== "USDT" && tokenItem.name !== "SATS"
        ) || [];
      return filter.map((res) => {
        return {
          value: res.symbol,
          label: res.symbol,
        };
      });
    }
    return [];
  }, [tokenList]);

  const sortOptions = [
    {
      value: "Price From Low to High",
      label: "Price From Low to High",
    },
    {
      value: "Price From High to Low",
      label: "Price From High to Low",
    },
    {
      value: "Amount From Small to Large",
      label: "Amount From Small to Large",
    },
    {
      value: "Amount From Large to Small",
      label: "Amount From Large to Small",
    },
    {
      value: "From Latest to Earliest",
      label: "From Latest to Earliest",
    },
    {
      value: "From Earliest to Latest",
      label: "From Earliest to Latest",
    },
  ];

  const tokenChange = (value) => {
    setPageIndex(1);
    setToken(value);
    let fin = tokenList.find((res) => res.name == value);
    setCurrentTokenInfo(fin);
  };

  const sortChange = useCallback((value) => {
    setPageIndex(1);
    setSort(value);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const showModal = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setCurrentOrder({});
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentOrder({});
  };

  const getBalance = useCallback(
    (order) => {
      if (order.type == "SELL") {
        return balanceList["SATS"] ? balanceList["SATS"].balanceShow : 0;
      } else {
        return balanceList[order.token]
          ? balanceList[order.token].balanceShow
          : 0;
      }
    },
    [balanceList]
  );

  const getTokenBalance = useCallback(
    (tokenName) => {
      return balanceList[tokenName] ? balanceList[tokenName].balanceShow : 0;
    },
    [balanceList]
  );

  const getBuyButton = () => {
    let balance = getTokenBalance("SATS");
    if (Number(balance) < Number(currentOrder.total_price)) {
      return (
        <Button className="buy-btn" type="primary">
          Insufficient balance
        </Button>
      );
    }

    if (Number(allowance.amountShow) < currentOrder.total_price) {
      return (
        <Button
          type="primary"
          className="buy-btn"
          disabled={!Number(balance) || Number(balance) === 0}
          loading={btnLoading}
        >
          Approve
        </Button>
      );
    }

    return (
      <Button
        className="buy-btn"
        type="primary"
        disabled={!Number(balance) || Number(balance) === 0}
        loading={btnLoading}
      >
        Buy {currentOrder.token}
      </Button>
    );
  };
  const getSellButton = () => {
    let balance = getTokenBalance(currentOrder.token);
    if (Number(balance) < Number(currentOrder.volume)) {
      return (
        <Button className="buy-btn sell-btn" type="primary">
          Insufficient balance
        </Button>
      );
    }

    if (Number(allowance.amountShow) < currentOrder.volume) {
      return (
        <Button
          type="primary"
          className="buy-btn sell-btn"
          disabled={!Number(balance) || Number(balance) === 0}
          loading={btnLoading}
        >
          Approve
        </Button>
      );
    }

    return (
      <Button
        className="buy-btn sell-btn"
        type="primary"
        disabled={!Number(balance) || Number(balance) === 0}
        loading={btnLoading}
      >
        Sell {currentOrder.token}
      </Button>
    );
  };

  const deleteOrderList = (id) => {
    let currentList = newList.filter((res) => res.id != id);
    setNewList(currentList);
  };
  return (
    <>
      <div className="listing">
        <div className="condition-box">
          <Radio.Group
            className="condition"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <Radio.Button value="Buy">Buy</Radio.Button>
            <Radio.Button
              style={{
                color: type == "Sell" ? "#D23850" : "#000",
                borderColor: type == "Sell" ? "#D23850" : "#d9d9d9",
              }}
              value="Sell"
            >
              Sell
            </Radio.Button>
          </Radio.Group>

          <Select
            className="condition"
            style={{ minWidth: 140 }}
            onChange={tokenChange}
            defaultValue={token}
            options={getTokenList()}
          />

          <Select
            className="condition"
            defaultValue="Price From Low to High"
            style={{ minWidth: 140 }}
            onChange={sortChange}
            options={sortOptions}
          />
        </div>

        <div className="listing-content">
          <List
            loading={fetching}
            grid={{
              gutter: 16,
              column: 4,
            }}
            dataSource={newList}
            renderItem={(item) => (
              <List.Item>
                <Card className="card-box">
                  <div className="top">
                    <div className="name">{item.token}</div>
                    <div className="tag-box">
                      <p>#{item.id}</p>
                    </div>
                    <div className="nums">{item.volume}</div>
                    <div className="price">{item.price} SATS/Price</div>
                  </div>
                  <div className="bottom">
                    <div className="url-box">
                      <p className="nums">
                        {item.type == "SELL" ? "Seller" : "Buyer"}
                      </p>
                      <p className="url">{shortenAddress(item.owner, 16)}</p>
                    </div>
                    <div className="line"></div>
                    <div className="figure-box">
                      <div className="left">
                        <img className="btc" src={btcIcon} alt="" />
                        <span>{item.total_price}</span>
                      </div>
                      <div className="right">SATS</div>
                    </div>
                    {item.type == "SELL" ? (
                      <Button
                        className="buy-btn"
                        type="primary"
                        onClick={() => {
                          showModal(item);
                        }}
                        disabled={item.owner == nostrAccount}
                      >
                        {item.owner == nostrAccount ? "Your own orders" : "Buy"}
                      </Button>
                    ) : (
                      <Button
                        className="buy-btn sell-btn"
                        type="primary"
                        onClick={() => {
                          showModal(item);
                        }}
                        disabled={item.owner == nostrAccount}
                      >
                        {item.owner == nostrAccount
                          ? "Your own orders"
                          : "Sell"}
                      </Button>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
          <div className="pagination">
            <Pagination defaultCurrent={1} total={1} />
          </div>
        </div>
      </div>
      <Modal
        className="listing-confirm-modal"
        width="400px"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="title">Confirm to {type == "Buy" ? "buy" : "sell"}</div>
        <div className="content">
          <div className="item">
            <span>Token</span>
            <span>{currentOrder.token || ""}</span>
          </div>
          <div className="item">
            <span>Price</span>
            <span>{currentOrder.price || 0} SATS</span>
          </div>
          <div className="item">
            <span>{type == "Buy" ? "Buy" : "Sell"} Amount</span>
            <span>{currentOrder.volume || 0}</span>
          </div>
          <div className="item">
            <span>Total Value</span>
            <span>{currentOrder.total_price || 0} SATS</span>
          </div>
        </div>
        <p className="balance">Balance:{getBalance(currentOrder)}</p>

        {type == "Buy" ? getBuyButton() : getSellButton()}
      </Modal>
    </>
  );
}
