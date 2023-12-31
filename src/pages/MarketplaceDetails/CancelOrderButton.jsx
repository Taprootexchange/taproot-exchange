import { useState, useCallback } from "react";
import { Button, message } from "antd";
function CancelButton({ reexcuteQuery, row }) {
  const [cancelLoading, setCancelLoading] = useState(false);
  return (
    <Button className="cancel" loading={cancelLoading} type="link">
      Cancel
    </Button>
  );
}

export default CancelButton;
