import { useEffect, memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Select, Row, Col } from "antd";
import useGetNostrAccount from "@/hooks/useGetNostrAccount";
import { useTokenChangeQuery } from "@/hooks/graphQuery/useExplore";
import { useState } from "react";
import { limitDecimals, numberWithCommas } from "@/lib/numbers";
import { nip19 } from "nostr-tools";
import BigNumber from "bignumber.js";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import { useMyOrderQuery } from "@/hooks/graphQuery/useExplore";
import dayjs from "dayjs";
import CancelButton from "./CancelOrderButton";

export default function MyOrder() {
  let { tokenList } = useTokenChangeQuery({});
  const { handleGetNostrAccount } = useGetNostrAccount();

  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [type, setType] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  const { nostrAccount } = useSelector(({ user }) => user);

  let { list, total, fetching, reexcuteQuery } = useMyOrderQuery({
    pageSize: pageSize,
    pageIndex: pageIndex,
    type,
    token,
    status,
    owner: nostrAccount,
  });

  const typeOptions = [
    {
      value: "",
      label: "Buy/Sell",
    },
    {
      value: "buy",
      label: "Buy",
    },
    {
      value: "sell",
      label: "Sell",
    },
  ];

  useEffect(() => {
    if (!nostrAccount) {
      handleGetNostrAccount();
    }
  }, [handleGetNostrAccount, nostrAccount]);

  const columns = [
    {
      title: "Event ID",
      dataIndex: "event_id",
      width: 120,
      render(text, _) {
        return text ? (
          <EllipsisMiddle suffixCount={4}>
            {nip19.noteEncode(text)}
          </EllipsisMiddle>
        ) : (
          "--"
        );
      },
    },
    {
      title: "Time",
      dataIndex: "create_time",
      width: 120,
      render: (text) =>
        text ? dayjs(Number(text)).format("YYYY-MM-DD HH:mm:ss") : "--",
    },
    {
      title: "Order ID",
      dataIndex: "id",
      render: (text) => {
        return text || "--";
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => {
        const row = typeOptions.find((item) => item.value == text);
        let cls;
        switch (text?.toLowerCase()) {
          case "buy":
            cls = "color-green";
            break;
          case "sell":
            cls = "color-red";
            break;
          default:
            cls = "";
        }
        return (
          <span className={cls}>{row?.label ? row?.label : text || "--"}</span>
        );
      },
    },

    {
      title: "Token",
      dataIndex: "token",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text, row) => {
        const cur = tokenList.find((item) => item.name == "SATS");
        return (
          <span className="color-yellow">
            {text && cur
              ? `${numberWithCommas(
                  limitDecimals(text / cur?.decimals, cur?.reserve)
                )} SATS`
              : "--"}
          </span>
        );
      },
    },
    {
      title: "Remaining",
      dataIndex: "deal_volume",
      render: (text, row) => {
        const cur = tokenList.find((item) => item.name == row.token);
        return (
          <span>
            {numberWithCommas(
              BigNumber(row.volume).minus(text).div(cur?.decimals).toNumber()
            )}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "volume",
      render: (text, row) => {
        const cur = tokenList.find((item) => item.name == row.token);
        return (
          <span>
            {numberWithCommas(BigNumber(text).div(cur?.decimals).toNumber())}
          </span>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "owner",
      width: 120,
      render(text) {
        return (
          <Row>
            <Col className="f12 Poppins">
              {text ? (
                <EllipsisMiddle suffixCount={4}>
                  {nip19.npubEncode(text)}
                </EllipsisMiddle>
              ) : (
                text || "--"
              )}
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        let cls;
        let txt;
        switch (text) {
          case "INIT":
          case "PUSH_MARKET_SUCCESS":
          case "TAKE_LOCK":
          case "TRADE_PENDING":
            txt = "Pending";
            break;
          case "PART_SUCCESS":
            txt = "Partial";
            cls = "color-yellow";
            break;
          case "SUCCESS":
            cls = "color-green";
            txt = "Success";
            break;
          case "CANCEL":
            txt = "Cancel";
            break;
          default:
            cls = "";
            txt = "";
        }
        return <span className={cls}>{txt || text || "--"}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text, row) => {
        if (
          [
            "INIT",
            "PUSH_MARKET_SUCCESS",
            "PUSH_MARKET_FAIL",
            "TAKE_LOCK",
            "PART_SUCCESS",
          ].includes(text)
        ) {
          return (
            <CancelButton
              reexcuteQuery={reexcuteQuery}
              row={row}
            ></CancelButton>
          );
        } else {
          return <span>--</span>;
        }
      },
    },
  ];
  list = list.map((res, index) => {
    res.key = index;
    return res;
  });

  const typeChange = useCallback((value) => {
    setPageIndex(1);
    setType(value);
  }, []);

  const getTokenList = useCallback(() => {
    let filter =
      tokenList.filter(
        (tokenItem) => tokenItem.name !== "USDT" && tokenItem.name != "SATS"
      ) || [];
    filter.unshift({ label: "All Token", value: "" });
    return filter.map((res) => {
      return {
        value: res.symbol || res.value,
        label: res.symbol || res.label,
      };
    });
  }, [tokenList]);

  const tokenChange = useCallback((value) => {
    setPageIndex(1);
    setToken(value);
  }, []);

  const statusOptions = useMemo(() => {
    return [
      {
        value: "",
        label: "All Status",
      },
      {
        value: "Open Orders",
        label: "Open Orders",
      },
      {
        value: "History Orders",
        label: "History Orders",
      },
    ];
  }, []);

  const statusChange = useCallback((value) => {
    setPageIndex(1);
    setStatus(value);
  }, []);

  return (
    <div className="my-order">
      <div className="condition-box">
        <Select
          className="condition"
          defaultValue="Buy/Sell"
          style={{ width: 120 }}
          onChange={typeChange}
          options={typeOptions}
        />

        <Select
          className="condition"
          defaultValue="All Token"
          style={{ minWidth: 140 }}
          onChange={tokenChange}
          options={getTokenList()}
        />

        <Select
          className="condition"
          defaultValue="All Status"
          style={{ minWidth: 140 }}
          onChange={statusChange}
          options={statusOptions}
        />
      </div>

      <div className="table-box">
        <Table
          loading={fetching}
          columns={columns}
          dataSource={list}
          size="middle"
        />
      </div>
    </div>
  );
}
