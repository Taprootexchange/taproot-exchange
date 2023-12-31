import { Tooltip } from "antd";
export default function MarketEventStatus({ text, row }) {
  let cls;
  let txt;
  switch (text?.toLowerCase()) {
    case "success":
      cls = "color-green";
      txt = "Success";
      break;
    case "fail":
      cls = "color-red";
      txt = "Failed";
      break;
    case "failed":
      cls = "color-red";
      txt = "Failed";
      break;
    case "pending":
      cls = "color-yellow";
      txt = "Pending";
      break;
    default:
      cls = "";
      txt = "";
  }
  if (txt == "Failed") {
    return (
      <Tooltip color="#6f6e84" title={row?.message_detail || ""}>
        <span className={cls}>{txt || text || "--"}</span>
      </Tooltip>
    );
  } else {
    return <span className={cls}>{txt || text || "--"}</span>;
  }
}
