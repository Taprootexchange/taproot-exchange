import {
  Select,
  Input,
  Button,
  Table,
  Row,
  Col,
  Modal,
  Typography,
} from "antd";
import "./index.scss";
import { useTokenQuery } from "@/hooks/graphQuery/useExplore";
import { useState, useCallback } from "react";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import dayjs from "dayjs";
import { nip19 } from "nostr-tools";
import { useTokenChangeQuery } from "@/hooks/graphQuery/useExplore";
import TokenEventStatus from "./comps/TokenEventStatus";

export default function TokenEvents() {
  const initQuery = {
    type: "",
    token: "",
    nostrAddress: "",
  };

  let { tokenList } = useTokenChangeQuery({});
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState({
    ...initQuery,
  });
  let { list, total, fetching, reexcuteQuery } = useTokenQuery({
    pageSize: pageSize,
    pageIndex: pageIndex,
    filter,
  });

  const getTokenList = useCallback(() => {
    let filter =
      tokenList.filter(
        (tokenItem) => tokenItem.name !== "USDT" && tokenItem.name !== "RO0T"
      ) || [];
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
      value: "deposit",
      label: "deposit",
    },
    {
      value: "withdraw",
      label: "withdraw",
    },
    {
      value: "approve",
      label: "approve",
    },
    {
      value: "transfer",
      label: "transfer",
    },

    {
      value: "transferFrom",
      label: "transferFrom",
    },
    {
      value: "openPro",
      label: "openPro",
    },
    {
      value: "closePro",
      label: "closePro",
    },
    {
      value: "deleteAddressBook",
      label: "deleteAddressBook",
    },
    {
      value: "addressBookAdd",
      label: "addressBookAdd",
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

  const addressChange = (e) => {
    setPageIndex(1);
    setFilter({
      ...filter,
      nostrAddress: e.target.value,
    });
  };

  const Reset = () => {
    setPageIndex(1);
    setFilter({
      ...initQuery,
    });
  };
  const columns = [
    {
      title: "Event ID",
      key: "event_id",
      dataIndex: "event_id",
      render(text, _) {
        return text ? (
          <EllipsisMiddle suffixCount={6}>
            {nip19.noteEncode(text)}
          </EllipsisMiddle>
        ) : (
          "--"
        );
      },
    },
    {
      title: "Time",
      key: "create_at",
      dataIndex: "create_at",
      render: (text) =>
        text ? dayjs.unix(Number(text)).format("YYYY-MM-DD HH:mm:ss") : "--",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      render: (text) => {
        const row = typeOptions.find((item) => item.value == text);
        return row?.label ? row?.label : text || "--";
      },
    },
    {
      title: "Token",
      key: "token",
      dataIndex: "token",
    },
    {
      title: "Address",
      key: "sender_address",
      dataIndex: "sender_address",
      render(text) {
        return (
          <Row>
            <Col className="f12 Poppins">
              {text ? (
                <EllipsisMiddle suffixCount={6}>
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
      key: "status",
      dataIndex: "status",
      render: (text, row) => {
        return <TokenEventStatus text={text} row={row} />;
      },
    },
    {
      title: "Detail",
      key: "detail",
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

  list = list.map((res, index) => {
    res.key = index;
    return res;
  });

  // Detail Modal
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

  const getTypeOption = (text) => {
    const row = typeOptions.find((item) => item.value == text);
    return row?.label ? row?.label : text || "--";
  };

  return (
    <>
      <div className="token-events">
        <div className="rilter-riteria">
          <div className="item">
            <span className="title">Type</span>
            <Select
              defaultValue={filter.type || "All"}
              value={filter.type || "All"}
              onChange={onTypeChange}
              style={{
                width: 120,
              }}
              options={typeOptions}
            />
          </div>
          <div className="item">
            <span className="title">Token</span>
            <Select
              defaultValue={filter.token || "All"}
              value={filter.token || "All"}
              onChange={onTokenChange}
              style={{
                width: 120,
              }}
              options={getTokenList()}
            />
          </div>
          <Input
            className="input-price"
            value={filter.nostrAddress || ""}
            placeholder="Please enter Event ID  or Address"
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
        width="600px"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="detail-modal-box">
          <div className="item">
            <div className="title">Event ID</div>
            <div className="content">
              <EllipsisMiddle suffixCount={6}>
                {currentModalData?.event_id
                  ? nip19.noteEncode(currentModalData?.event_id)
                  : ""}
              </EllipsisMiddle>
            </div>
          </div>
          <div className="item">
            <div className="title">Time</div>
            <div className="content">
              {dayjs
                .unix(Number(currentModalData?.create_at))
                .format("YYYY-MM-DD HH:mm:ss")}
            </div>
          </div>
          <div className="item">
            <div className="title">Token</div>
            <div className="content">{currentModalData?.token}</div>
          </div>
          <div className="item">
            <div className="title">Type</div>
            <div className="content">
              {getTypeOption(currentModalData?.type)}
            </div>
          </div>
          <div className="item">
            <div className="title">Event content</div>
            <div className="content">
              {currentModalData?.event_content &&
              currentModalData?.event_content?.length > 20 ? (
                <EllipsisMiddle suffixCount={8}>
                  {currentModalData?.event_content || "--"}
                </EllipsisMiddle>
              ) : (
                currentModalData?.event_content
              )}
            </div>
          </div>
          <div className="item">
            <div className="title">Plain text content</div>
            <div className="content">
              {currentModalData?.plaintext_content &&
              currentModalData?.plaintext_content?.length > 20 ? (
                <EllipsisMiddle suffixCount={8}>
                  {currentModalData?.plaintext_content || "--"}
                </EllipsisMiddle>
              ) : (
                currentModalData?.plaintext_content
              )}
            </div>
          </div>
          <div className="item">
            <div className="title">Address</div>
            <div className="content">
              <EllipsisMiddle suffixCount={6}>
                {currentModalData?.sender_address
                  ? nip19.npubEncode(currentModalData?.sender_address)
                  : "--"}
              </EllipsisMiddle>
            </div>
          </div>
          <div className="item">
            <div className="title">Status</div>
            <div className="content">
              <TokenEventStatus
                text={currentModalData?.status}
                row={currentModalData}
              />
            </div>
          </div>
          <div className="item">
            <div className="title">Amount</div>
            <div className="content">{currentModalData.amount}</div>
          </div>
          <div className="item">
            <div className="title">From</div>
            <div className="content">
              {currentModalData?.from_address ? (
                <EllipsisMiddle suffixCount={6}>
                  {currentModalData?.from_address?.indexOf("npub") < 0
                    ? nip19.npubEncode(currentModalData?.from_address)
                    : currentModalData?.from_address}
                </EllipsisMiddle>
              ) : (
                "--"
              )}
            </div>
          </div>
          <div className="item">
            <div className="title">To</div>
            <div className="content">
              {currentModalData?.to_address ? (
                <EllipsisMiddle suffixCount={6}>
                  {currentModalData?.to_address?.indexOf("npub") < 0
                    ? nip19.npubEncode(currentModalData?.to_address)
                    : currentModalData?.to_address}
                </EllipsisMiddle>
              ) : (
                "--"
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
