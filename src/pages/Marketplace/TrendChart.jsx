import {
  useTokenChangeQuery,
  useTokenKlineQuery,
} from "@/hooks/graphQuery/useExplore";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { handleKlineData, finLastKline, getKlineChange } from "@/lib/utils";

let option = {
  color: ["#5dbf69"],
  xAxis: {
    show: false,
    type: "category",
    splitLine: {
      show: false,
    },
  },
  grid: {
    left: "0%",
    right: "0%",
    bottom: "0%",
    top: "0%",
  },

  yAxis: {
    show: false,
    type: "value",
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      type: "line",
      showSymbol: false,
      data: [],
      lineStyle: {
        width: 1.2,
      },
    },
  ],
};
export default function TrendChart({ token, setChange }) {
  let { klineData } = useTokenKlineQuery({ token: token });
  const chartpie = useRef(null);
  let mychart = null;
  useEffect(() => {
    if (klineData.length) {
      let chartData = handleKlineData(klineData);
      option.xAxis.data = chartData.xdata;
      option.yAxis.data = chartData.ydata;

      let max = Math.max(...chartData.ydata);
      option.yAxis.data.push(max + max * 0.3);
      option.series[0].data = chartData.ydata;
      if (mychart == null) {
        mychart = echarts.init(chartpie.current);
      }
      mychart.setOption(option, true);

      let lastKline = finLastKline(klineData);
      if (lastKline) {
        setChange({
          token: token,
          change: getKlineChange(lastKline),
          high_price: lastKline.high_price,
          low_price: lastKline.high_price,
          volume: lastKline.volume,
        });
      } else {
        setChange({
          token: token,
          change: 0,
          high_price: 0,
          low_price: 0,
          volume: 0,
        });
      }
    }
  }, [klineData]);

  return <div className="trend-kline" ref={chartpie}></div>;
}
