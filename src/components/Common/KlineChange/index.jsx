import "./index.scss";
export default function KlineChange({ change }) {
  const getChangeColor = (change) => {
    if (!change || change == 0) return "";
    if (change > 0) {
      return "color-green";
    }
    if (change < 0) {
      return "color-red";
    }
  };
  return (
    <span className={`default-style ${getChangeColor(change)}`}>
      {change != undefined && change != null ? change + "%" : "--"}
    </span>
  );
}
