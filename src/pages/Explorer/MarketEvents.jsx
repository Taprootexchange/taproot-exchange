import { Select, Input, Button, Table, Row, Col, Tooltip, Modal } from "antd";
import "./index.scss";
import { useMarketQuery } from "@/hooks/graphQuery/useExplore";
import { useState, useCallback, useMemo } from "react";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import dayjs from "dayjs";
import { useTokenChangeQuery } from "@/hooks/graphQuery/useExplore";
import MarketEventStatus from "./comps/MarketEventStatus";

const initQuery = {
  type: "",
  token: "",
  nostrAddress: "",
};

export default function MarketEvents() {
  let { tokenList } = useTokenChangeQuery({});
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState({ ...initQuery });
  let { list, total, fetching, reexcuteQuery } = useMarketQuery({
    pageSize: pageSize,
    pageIndex: pageIndex,
    filter,
  });

  const getTokenList = useCallback(() => {
    let filter =
      tokenList.filter((tokenItem) => tokenItem.name !== "USDT") || [];
    filter.unshift({
      value: "",
      label: "All",
    });
    return filter.map((res) => {
      return {
        value: res.symbol || res.value,
        label: res.symbol || res.label,
      };
    });
  }, [tokenList]);
  const typeOptions = [
    {
      value: "",
      label: "All",
    },
    {
      value: "PlaceOrder",
      label: "PlaceOrder",
    },
    {
      value: "Batch",
      label: "Batch",
    },
    {
      value: "Cancel Order",
      label: "Cancel Order",
    },
    {
      value: "Take order",
      label: "Take order",
    },
  ];

  const onTypeChange = (type) => {
    setPageIndex(1);
    setFilter({
      ...filter,
      type: type,
    });
  };

  const onTokenChange = (token) => {
    setPageIndex(1);
    setFilter({
      ...filter,
      token: token,
    });
  };

  const addressChange = useCallback((e) => {
    setPageIndex(1);
    setFilter({
      ...filter,
      nostrAddress: e.target.value,
    });
  }, []);

  const Reset = () => {
    setPageIndex(1);
    setFilter({
      ...initQuery,
    });
  };
  const columns = [
    {
      title: "Event ID",
      key: "messageid",
      dataIndex: "messageid",
      render(text, _) {
        return <EllipsisMiddle suffixCount={6}>{text}</EllipsisMiddle>;
      },
    },
    {
      title: "Time",
      key: "create_time",
      dataIndex: "create_time",
      render: (text) =>
        text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Token",
      key: "token",
      dataIndex: "token",
    },
    {
      title: "Address",
      key: "nostr_address",
      dataIndex: "nostr_address",
      render(text) {
        return (
          <Row>
            <Col className="f12 Poppins">
              {text ? (
                <EllipsisMiddle suffixCount={6}>{text}</EllipsisMiddle>
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
      key: "status",
      dataIndex: "status",
      render: (text, row) => {
        return <MarketEventStatus text={text} row={row} />;
      },
    },
    {
      title: "Detail",
      key: "detail",
      dataIndex: "detail",
      render: (text, row) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              showModal(row);
            }}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  list = list.map((res, index) => {
    res.key = index;
    return res;
  });

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

  const messageDetail = useMemo(() => {
    const data = currentModalData?.message_detail
      ? JSON.parse(currentModalData?.message_detail)
      : [];
    return Array.isArray(data) ? data : [data];
  }, [currentModalData?.message_detail]);

  return (
    <>
      <div className="market-events">
        <div className="rilter-riteria">
          <div className="item">
            <span className="title">Type</span>
            <Select
              defaultValue={filter.type || "All"}
              value={filter.type || "All"}
              style={{
                width: 120,
              }}
              onChange={onTypeChange}
              options={typeOptions}
            />
          </div>
          <div className="item">
            <span className="title">Token</span>
            <Select
              defaultValue={filter.token || "All"}
              value={filter.token || "All"}
              style={{
                width: 120,
              }}
              onChange={onTokenChange}
              options={getTokenList()}
            />
          </div>
          <Input
            className="input-price"
            placeholder="Please enter Event ID  or Address"
            value={filter.nostrAddress || ""}
            onChange={addressChange}
          />

          <Button className="reset" onClick={Reset}>
            Reset
          </Button>
        </div>
        <div className="list">
          <Table
            loading={fetching}
            columns={columns}
            size="middle"
            dataSource={list}
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        className=""
        width="800px"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="market-event-modal-content">
          <div className="left">
            <div className="detail-modal-box">
              <div className="item">
                <div className="title">Event ID</div>
                <div className="content">
                  {currentModalData?.messageid ? (
                    <EllipsisMiddle suffixCount={6}>
                      {currentModalData?.messageid}
                    </EllipsisMiddle>
                  ) : (
                    "--"
                  )}
                </div>
              </div>
              <div className="item">
                <div className="title">Detail</div>
                <div className="content">
                  {currentModalData?.plaintext_context ? (
                    <EllipsisMiddle suffixCount={8}>
                      {currentModalData?.plaintext_context}
                    </EllipsisMiddle>
                  ) : (
                    "--"
                  )}
                </div>
              </div>
              <div className="item">
                <div className="title">Time</div>
                <div className="content">
                  {currentModalData?.create_time
                    ? dayjs(currentModalData?.create_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )
                    : "--"}
                </div>
              </div>
              <div className="item">
                <div className="title">Type</div>
                <div className="content">{currentModalData?.type || "--"}</div>
              </div>
              <div className="item">
                <div className="title">Address</div>
                <div className="content">
                  {currentModalData?.nostr_address && (
                    <EllipsisMiddle suffixCount={6}>
                      {currentModalData?.nostr_address || "--"}
                    </EllipsisMiddle>
                  )}
                </div>
              </div>
              <div className="item">
                <div className="title">Status</div>
                <div className="content">
                  {currentModalData?.status || "--"}
                </div>
              </div>
              <div className="item">
                <div className="title">Token</div>
                <div className="content">{currentModalData?.token || "--"}</div>
              </div>
            </div>
          </div>

          <div className="right">
            {messageDetail.map((item, i) => {
              return (
                <div key={item.OrderID + i} className="detail-modal-box">
                  <div className="item">
                    <div className="title">Order ID</div>
                    <div className="content">{item?.OrderID || "--"}</div>
                  </div>

                  <div className="item">
                    <div className="title">Type</div>
                    <div
                      className={`content ${
                        item?.Type?.toLowerCase() == "sell"
                          ? "color-red"
                          : "color-green"
                      }`}
                    >
                      {item.Type}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">Amount</div>
                    <div className="content">{item?.Amount || "--"}</div>
                  </div>
                  <div className="item">
                    <div className="title">Price</div>
                    <div className="content">{item?.Price || "--"} SATS</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
