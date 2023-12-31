import "./index.scss";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import { getQueryVariable, shortenAddress } from "@/lib/utils";
import { Button, Modal, Radio, Select, Input } from "antd";
import { useMemo, useState, useEffect, useRef, useCallback, memo } from "react";
import { useSelector } from "react-redux";
import Menu from "@/components/Common/Menu";
import { Link, Outlet } from "react-router-dom";
import * as echarts from "echarts";
import ChartOption from "./ChartOption";
import {
  useTokenChangeQuery,
  useTokenKlineQuery,
} from "@/hooks/graphQuery/useExplore";
import useGetNostrAccount from "@/hooks/useGetNostrAccount";
import { nip19 } from "nostr-tools";
import { limitDecimals } from "@/lib/numbers";
import KlineChange from "../../components/Common/KlineChange";
import { useGetUsdPrice } from "@/hooks/useQueryBtcPrice";
import {
  nul,
  handleKlineData,
  finLastKline,
  getKlineChange,
  getNetworkImg,
} from "@/lib/utils";

function getItem(label, key) {
  return {
    label,
    key,
  };
}

function MarketplaceDetails() {
  const [btnLoading, setBtnLoading] = useState(false);
  const { handleGetNostrAccount } = useGetNostrAccount();
  const [buyOrSell, setBuyOrSell] = useState("buy");
  const [selectedToken, setSelectedToken] = useState(null);
  const [priceValue, setPriceValue] = useState("");
  const [allowance, setAllowance] = useState({});
  const [amountValue, setAmountValue] = useState(0);
  let { tokenList } = useTokenChangeQuery({});
  const { balanceList, nostrAccount } = useSelector(({ user }) => user);
  let { getUsdPrice } = useGetUsdPrice();
  const [currentTokenInfo, setCurrentTokenInfo] = useState({
    symbol: getQueryVariable("token"),
  });
  let { klineData } = useTokenKlineQuery({ token: currentTokenInfo.symbol });

  const chartpie = useRef(null);
  let mychart = null;

  useEffect(() => {
    let chartData = handleKlineData(klineData);
    ChartOption.xAxis.data = chartData.xdata;
    ChartOption.series[0].data = chartData.ydata;
    if (mychart == null) {
      mychart = echarts.init(chartpie.current);
    }
    mychart.setOption(ChartOption, true);

    let lastKline = finLastKline(klineData);
    if (lastKline) {
      setCurrentTokenInfo({
        ...currentTokenInfo,
        tf_change: getKlineChange(lastKline),
        volume: lastKline.volume,
      });
    }
  }, [klineData]);
  const titleItems = useMemo(() => {
    return [
      getItem(<Link to="listing">Listing</Link>, "listing"),
      getItem(<Link to="order-history">Order History</Link>, "order-history"),
      getItem(<Link to="my-order">My Order</Link>, "my-order"),
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setPriceValue("");
    setAmountValue("");
    if (!nostrAccount) {
      handleGetNostrAccount();
      return;
    }

    setIsModalOpen(true);
  };

  useEffect(() => {
    if (tokenList.length) {
      let filter = tokenList.filter(
        (tokenItem) => tokenItem.name !== "USDT" && tokenItem.name !== "SATS"
      );
      setSelectedToken(filter[0]);
      if (currentTokenInfo.symbol) {
        let queryCurrentInfo = filter.find(
          (res) => res.symbol == currentTokenInfo.symbol
        );
        if (queryCurrentInfo) {
          setCurrentTokenInfo({
            ...currentTokenInfo,
            ...queryCurrentInfo,
          });
        }
      }
    }
  }, [tokenList]);

  const getTokenBalance = useCallback(
    (tokenName) => {
      return balanceList[tokenName] ? balanceList[tokenName].balanceShow : 0;
    },
    [balanceList]
  );
  const getTokenList = useCallback(() => {
    let filter =
      tokenList.filter(
        (tokenItem) => tokenItem.name !== "USDT" && tokenItem.name !== "SATS"
      ) || [];
    return filter.map((res) => {
      return {
        value: res.symbol || res.value,
        label: res.symbol || res.label,
      };
    });
  }, [tokenList]);

  const handleTokenChange = (symbol) => {
    const tempSelectedToken = tokenList.find((item) => item.symbol === symbol);
    setSelectedToken(tempSelectedToken);
    setPriceValue("");
    setAmountValue("");
  };
  const onPriceChange = useCallback((e) => {
    let value = e.target.value;
    if (Number(value)) {
      const match = String(value).match(/\d+/);
      setPriceValue(match[0]);
    } else if (value && !Number.isNaN(value) && Number(value) >= 0) {
      setPriceValue(value);
    } else {
      setPriceValue(String(value).substring(0, String(value).length - 1));
    }
  });

  const onAmountChange = useCallback((e) => {
    let value = e.target.value;

    if (Number(value)) {
      const match = String(value).match(/\d+/);
      setAmountValue(match[0]);
    } else if (value && !Number.isNaN(value) && Number(value) >= 0) {
      setAmountValue(value);
    } else {
      setAmountValue(String(value).substring(0, String(value).length - 1));
    }
  });

  const memoTotalValue = useMemo(() => {
    return limitDecimals(nul(priceValue, amountValue), 4, "round");
  }, [amountValue, priceValue]);

  const handleMax = useCallback(() => {
    if (buyOrSell === "sell") {
      const maxAmount = getTokenBalance(selectedToken?.symbol);
      setAmountValue(maxAmount);
    } else {
      if (!priceValue) {
        setAmountValue(0);
      } else {
        const maxAmount = parseInt(getTokenBalance("SATS") / priceValue);
        setAmountValue(maxAmount);
      }
    }
  }, [buyOrSell, getTokenBalance, priceValue, selectedToken?.name]);

  function GetBuyBtn() {
    let balance = getTokenBalance("SATS");
    if (Number(balance) < Number(memoTotalValue)) {
      return <Button type="primary">Insufficient balance</Button>;
    }
    if (Number(allowance.amountShow) < memoTotalValue) {
      return (
        <Button
          type="primary"
          disabled={Number(balance) === 0}
          loading={btnLoading}
        >
          Approve
        </Button>
      );
    }

    return (
      <Button
        type="primary"
        disabled={!Number(balance) || Number(balance) === 0}
        loading={btnLoading}
      >
        Buy {selectedToken?.symbol}
      </Button>
    );
  }
  function GetSellBtn() {
    let balance = getTokenBalance(selectedToken?.symbol);

    if (
      Number(amountValue) &&
      Number(balance) &&
      Number(amountValue) > Number(balance)
    ) {
      return <Button type="primary">Insufficient balance</Button>;
    }
    if (Number(allowance.amountShow) < amountValue) {
      return (
        <Button
          type="primary"
          disabled={!Number(balance) || Number(balance) === 0}
          style={{ backgroundColor: "#D23850" }}
          loading={btnLoading}
        >
          Approve
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        disabled={!Number(balance) || Number(balance) === 0}
        style={{ backgroundColor: "#D23850" }}
        loading={btnLoading}
      >
        Sell {selectedToken?.symbol}
      </Button>
    );
  }

  return (
    <>
      <div className="bgc-box">
        <div className="marketplace-details">
          <div className="header-box">
            <div className="top">
              <div className="left-box">
                <img
                  className="token-logo"
                  src={getNetworkImg(currentTokenInfo.symbol)}
                />
                <p className="token-name">{currentTokenInfo.symbol}</p>
                <p className="divider"></p>
                <KlineChange change={currentTokenInfo.tf_change || "0"} />
              </div>
              <div className="right-box">
                TAP-20 Token Address:
                <EllipsisMiddle suffixCount={16}>
                  {currentTokenInfo.token ? currentTokenInfo.token : "--"}
                </EllipsisMiddle>
              </div>
            </div>
            <div className="content">
              <div className="left">
                <div className="floor">
                  <p className="title">Floor Price</p>
                  <p className="nums">
                    <span>
                      {currentTokenInfo?.deal_price} SATS ≈
                      {getUsdPrice(currentTokenInfo?.deal_price || 0, 4)}
                    </span>
                  </p>
                </div>
                <div className="unit-price">
                  <p className="title">24h Volume/Total Volume</p>
                  <p className="nums">
                    {getUsdPrice(currentTokenInfo?.volume || 0, 2)} /{" "}
                    {getUsdPrice(currentTokenInfo?.tf_total_price || 0, 2)}
                  </p>
                </div>
                <div className="total-vol">
                  <p className="title">Total Supply/Market Cap</p>
                  <p className="nums">
                    {currentTokenInfo?.totalSupply}/
                    {getUsdPrice(
                      currentTokenInfo?.deal_price *
                        currentTokenInfo?.totalSupply || 0,
                      0
                    )}
                  </p>
                </div>
                <div className="total-vol">
                  <p className="title">Holders</p>
                  <p className="nums">0</p>
                </div>
              </div>
              <div className="right">
                <div className="kline" ref={chartpie}></div>
              </div>
            </div>
          </div>
          <div className="listing-box">
            <div className="menu-box">
              <Menu items={titleItems} />
              <Button type="primary" onClick={showModal}>
                Sell TAP-20 Assets
              </Button>
            </div>
            <div className="line-box"></div>
            <Outlet context={[currentTokenInfo, setCurrentTokenInfo]} />
          </div>
        </div>
        <Modal
          className="make-new-listing"
          width="400px"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <div className="condition">
            <Radio.Group
              value={buyOrSell}
              onChange={(e) => {
                setBuyOrSell(e.target.value);
                setPriceValue("");
                setAmountValue("");
              }}
            >
              <Radio.Button value="buy">Buy Token</Radio.Button>
              <Radio.Button
                style={{
                  color: buyOrSell == "sell" ? "#D23850" : "#000",
                  borderColor: buyOrSell == "sell" ? "#D23850" : "#d9d9d9",
                }}
                value="sell"
              >
                Sell Token
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className="content-box">
            <div className="item">
              <div className="title">Token</div>
              <div className="content">
                <Select
                  className="select"
                  style={{ minWidth: 140 }}
                  defaultValue={selectedToken ? selectedToken.symbol : ""}
                  onChange={handleTokenChange}
                  options={getTokenList()}
                />
              </div>
            </div>
            <div className="item">
              <div className="title">
                {buyOrSell == "buy" ? "Buy" : "Sell"} Price
              </div>
              <div className="content">
                <Input
                  className="input-price"
                  onChange={onPriceChange}
                  style={{ width: "180px" }}
                  controls={false}
                  value={priceValue}
                />
                <span>SATS</span>
              </div>
            </div>
            <div className="item">
              <div className="title">
                {" "}
                {buyOrSell == "buy" ? "Buy" : "Sell"} Amount
              </div>
              <div className="content">
                <Input
                  onChange={onAmountChange}
                  controls={false}
                  style={{ width: "180px" }}
                  value={amountValue}
                  addonAfter={
                    <Button type="link" onClick={handleMax}>
                      max
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="item">
              <div className="title">Total Value</div>
              <div className="content">
                <span className="nums">{memoTotalValue}</span> SATS
              </div>
            </div>
          </div>
          {buyOrSell == "buy" ? (
            <p className="balance">Balance: {getTokenBalance("SATS")} SATS</p>
          ) : (
            <p className="balance">
              Balance: {getTokenBalance(selectedToken?.symbol)}{" "}
              {selectedToken?.symbol}
            </p>
          )}
          <div className="btn">
            {buyOrSell == "buy" ? <GetBuyBtn /> : <GetSellBtn />}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default MarketplaceDetails;
