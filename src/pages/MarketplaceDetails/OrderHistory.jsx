import { useEffect, memo, useCallback, useMemo } from "react";
import { Table, Select, Input, Row, Col, Button } from "antd";
import {
  useListingOrderQuery,
  useTokenChangeQuery,
} from "@/hooks/graphQuery/useExplore";
import { useState } from "react";
import { limitDecimals, numberWithCommas } from "@/lib/numbers";
import BigNumber from "bignumber.js";
import { useDebounce } from "ahooks";
import { getQueryVariable } from "@/lib/utils";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import { nip19 } from "nostr-tools";
import dayjs from "dayjs";
import OrderHistoryDetail from "./comps/OrderHistoryDetail";

export default function MyOrder() {
  let { tokenList } = useTokenChangeQuery({});
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [type, setType] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [nostrAddress, setNostrAddress] = useState(
    getQueryVariable("nostrAddress")
  );
  const debouncedNostrAddress = useDebounce(nostrAddress, { wait: 1000 });

  let { list, total, fetching, reexcuteQuery } = useListingOrderQuery({
    pageSize: pageSize,
    pageIndex: pageIndex,
    type,
    token,
    status,
    nostrAddress: debouncedNostrAddress,
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

  const typeChange = useCallback((value) => {
    setPageIndex(1);
    setType(value);
  }, []);

  const tokenChange = useCallback((value) => {
    setPageIndex(1);
    setToken(value);
  }, []);

  const statusChange = useCallback((value) => {
    setPageIndex(1);
    setStatus(value);
  }, []);

  const addressChange = useCallback((e) => {
    //
    setPageIndex(1);
    setNostrAddress(e.target.value);
  }, []);

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
      width: 130,
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
      title: "Detail",
      dataIndex: "detail",
      render: (text, row) => (
        <Button
          type="primary"
          onClick={() => {
            showModal(row);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalData, setCurrentModalData] = useState({});
  const showModal = (data) => {
    setCurrentModalData(data);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  list = list.map((res, index) => {
    res.key = index;
    return res;
  });
  return (
    <>
      <div className="order-history">
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
          <Input
            placeholder="Please enter Event Id or Address"
            onChange={addressChange}
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
      <OrderHistoryDetail
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        currentModalData={currentModalData}
      ></OrderHistoryDetail>
    </>
  );
}
