import { useEffect } from "react";
import { Table, Divider, Tag, Space, Spin } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTokenChangeQuery } from "@/hooks/graphQuery/useExplore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrendChart from "./TrendChart";
import KlineChange from "../../components/Common/KlineChange";
import { getNetworkImg } from "@/lib/utils";
import { useGetUsdPrice } from "@/hooks/useQueryBtcPrice";

export default function Hot() {
  const navigate = useNavigate();
  const handleNavigate = (record) => {
    const tokenID = record.symbol;
    navigate(`/marketplace-details/listing?token=${tokenID}`);
  };

  let { list, fetching, reexcuteQuery } = useTokenChangeQuery({});
  let [newList, setNewList] = useState([]);
  let { getUsdPrice } = useGetUsdPrice();

  useEffect(() => {
    if (list && Array.isArray(list) && list.length) {
      setNewList(
        list.filter((res, index) => {
          if (res.symbol != "USDT" && res.symbol != "SATS") {
            res.key = index;
            return res;
          }
        })
      );
    }
  }, [list]);

  const setChange = (data) => {
    let fin = newList.findIndex((res) => res.name == data.token);
    if (fin != -1) {
      newList[fin].tf_change = data.change;
      newList[fin].high_price = data.high_price;
      newList[fin].low_price = data.low_price;
      setNewList(JSON.parse(JSON.stringify(newList)));
    }
  };

  const columns = [
    {
      title: "Assets Symbol",
      dataIndex: "name",
      render: (text, recrod) => (
        <div className="assets-symbol">
          <img src={getNetworkImg(text)} alt="" className="token-icon" />
          <span className="token-name">{text}</span>
          <Tag className="token-line">{"TAP-20"}</Tag>
        </div>
      ),
    },
    {
      title: "Floor Price(SATS)",
      dataIndex: "deal_price",
      render: (text, record) => {
        let usdPrice = getUsdPrice(text, 4);

        return (
          <span className="font-style">
            {text} ≈ {usdPrice}
          </span>
        );
      },
    },
    {
      title: "Change",
      dataIndex: "tf_change",
      render: (text, recrod) => (
        <>
          <KlineChange change={text} />
        </>
      ),
    },
    {
      title: "Volume",
      dataIndex: "tf_total_price",
      render: (text, recrod) => (
        <>
          <span className="font-style">{getUsdPrice(text, 4)}</span>
        </>
      ),
    },
    {
      title: "24h High Price",
      dataIndex: "high_price",
      render: (text, recrod) => <>{text || "--"}</>,
    },
    {
      title: "24h Low Price",
      dataIndex: "low_price",
      render: (text, recrod) => <>{text || "--"}</>,
    },
    {
      title: "Market Cap",
      dataIndex: "low_price",
      render: (text, recrod) => (
        <>{getUsdPrice(recrod.totalSupply * recrod.deal_price, 4)}</>
      ),
    },
    {
      dataIndex: "name",
      render: (text, recrod) => (
        <>
          <TrendChart token={text} setChange={setChange}></TrendChart>
        </>
      ),
    },
    {
      width: 20,
      render: () => (
        <Space>
          <RightOutlined style={{ fontSize: "14px", color: "#333333" }} />
        </Space>
      ),
    },
  ];
  return (
    <div className="content-box">
      <Table
        loading={fetching}
        columns={columns}
        dataSource={newList}
        size="middle"
        onRow={(record) => {
          return {
            onClick: (e) => {
              handleNavigate(record);
            },
          };
        }}
      />
    </div>
  );
}
