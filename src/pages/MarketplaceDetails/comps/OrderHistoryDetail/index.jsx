import { Modal, Spin, Empty } from "antd";
import EllipsisMiddle from "@/components/EllipsisMiddle";
import dayjs from "dayjs";
import { useMemo } from "react";
import { nip19 } from "nostr-tools";
import { useOrderDetailQuery } from "@/hooks/graphQuery/useExplore";
export default function OrderHistoryDetail({
  isModalOpen,
  handleOk,
  handleCancel,
  currentModalData,
}) {
  const { list, fetching, reexcuteQuery } = useOrderDetailQuery({
    pageSize: 50,
    pageIndex: 1,
    id: currentModalData?.id,
    type: currentModalData?.type,
  });

  const trend_side = useMemo(() => {
    return currentModalData?.type?.toLowerCase() == "buy" ? "Sell" : "Buy";
  }, [currentModalData?.type]);

  const statusMemo = useMemo(() => {
    let cls;
    let txt;
    switch (currentModalData?.status) {
      case "INIT":
      case "PUSH_MARKET_SUCCESS":
      case "PUSH_MARKET_FAIL":
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
      case "CANCEL_PENDING":
      case "CANCEL":
        txt = "Cancel";
        break;
      default:
        cls = "";
        txt = "";
    }
    return (
      <span className={cls}>{txt || currentModalData?.status || "--"}</span>
    );
  }, [currentModalData?.status]);

  return (
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
                {currentModalData?.event_id ? (
                  <EllipsisMiddle suffixCount={6}>
                    {currentModalData?.event_id}
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
              <div className="title">Order ID</div>
              <div className="content">{currentModalData?.id || "--"}</div>
            </div>
            <div className="item">
              <div className="title">Type</div>
              <div className="content">{currentModalData?.type || "--"}</div>
            </div>
            <div className="item">
              <div className="title">Amount</div>
              <div className="content">{currentModalData.volume || "--"}</div>
            </div>
            <div className="item">
              <div className="title">Price</div>
              <div className="content">
                {currentModalData.price || "--"} SATS
              </div>
            </div>
            <div className="item">
              <div className="title">Address</div>
              <div className="content">
                {currentModalData?.owner && (
                  <EllipsisMiddle suffixCount={6}>
                    {nip19.npubEncode(currentModalData?.owner)}
                  </EllipsisMiddle>
                )}
              </div>
            </div>
            <div className="item">
              <div className="title">Status</div>
              <div className="content">{statusMemo}</div>
            </div>
            <div className="item">
              <div className="title">Token</div>
              <div className="content">{currentModalData?.token || "--"}</div>
            </div>
            <div className="item">
              <div className="title">Average Executed Price</div>
              <div className="content">
                {currentModalData?.avg_price || "--"} SATS
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          {!fetching && !list.length ? <Empty description={false} /> : ""}
          {fetching ? (
            <Spin />
          ) : (
            list.map((item, i) => {
              return (
                <div key={item.OrderID + i} className="detail-modal-box">
                  <div className="item">
                    <div className="title">Order ID</div>
                    <div className="content">
                      {item?.[trend_side?.toLowerCase() + "_order_id"] || "--"}
                    </div>
                  </div>

                  <div className="item">
                    <div className="title">Type</div>
                    <div
                      className={`content ${
                        trend_side == "Sell" ? "color-red" : "color-green"
                      }`}
                    >
                      {trend_side}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">Amount</div>
                    <div className="content">{item?.volume || "--"}</div>
                  </div>
                  <div className="item">
                    <div className="title">Price</div>
                    <div className="content">{item?.price || "--"} SATS</div>
                  </div>
                  <div className="item">
                    <div className="title">Address</div>
                    <div className="content">
                      {item?.[trend_side?.toLowerCase() + "_owner"] && (
                        <EllipsisMiddle suffixCount={6}>
                          {nip19.npubEncode(
                            item?.[trend_side?.toLowerCase() + "_owner"]
                          )}
                        </EllipsisMiddle>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
