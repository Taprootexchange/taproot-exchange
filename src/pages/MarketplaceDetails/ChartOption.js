import * as echarts from "echarts";
export default {
  grid: {
    left: "0%",
    right: "3%",
    bottom: "5%",
    containLabel: true,
  },
  xAxis: {
    show: true,
    type: "category",
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: "#A9A9A9",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: {
        color: "#A9A9A9",
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "solid",
        color: "#fff",
      },
    },
  },
  series: [
    {
      data: [],
      type: "line",
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: "#00EAB7",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: "rgba(142, 242, 126, 0.00)",
          },
          {
            offset: 1,
            color: "rgba(142, 242, 126, 0.3)",
          },
        ]),
      },
    },
  ],
};
