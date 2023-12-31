import { Tooltip } from "antd";
export default function TokenEventStatus({ text, row }) {
  let cls;
  let txt;
  switch (text) {
    case 0:
      cls = "color-green";
      txt = "Success";
      break;
    case 1:
      cls = "color-red";
      txt = "Failed";
      break;
    default:
      cls = "";
      txt = "";
  }
  if (txt == "Failed") {
    return (
      <Tooltip color="#6f6e84" title={row?.error}>
        <span className={cls}>{txt || text || "--"}</span>
      </Tooltip>
    );
  } else {
    return <span className={cls}>{txt || text || "--"}</span>;
  }
}
