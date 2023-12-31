import { Button, Modal } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import "./index.scss";
export default function Disclaimer({ isDisclaimer, setIsDisclaimer }) {
  const scrollRef = useRef();
  const [isDisabled, setIsDisabled] = useState(true);

  const understand = () => {
    localStorage.setItem("init", 1);
    setIsDisclaimer(false);
  };
  useEffect(() => {
    if (!isDisclaimer) return;
    const handleScroll = () => {
      const scrollElement = scrollRef.current;
      const scrollHeight = scrollElement.scrollHeight;
      const scrollTop = scrollElement.scrollTop;
      const clientHeight = scrollElement.clientHeight;
      if (scrollHeight - scrollTop <= clientHeight + 5) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };
    const scrollElement = scrollRef.current;
    scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [isDisclaimer]);
  return (
    <Modal
      className="Disclaimer"
      title="Disclaimer"
      open={isDisclaimer}
      keyboard={false}
      maskClosable={false}
      closeIcon={false}
      footer={null}
    >
      <div className="info" ref={scrollRef}>
        <h3>1.Accuracy of Information: </h3>
        <p>
          The information provided on this website is for general informational
          purposes only. We make no representations or warranties of any kind,
          express or implied, about the completeness, accuracy, reliability,
          suitability, or availability with respect to the website or the
          information contained on it for any purpose.
        </p>
        <h3>2.External Links:</h3>
        <p>
          Our website may contain links to external websites that are not
          provided or maintained by us. We do not guarantee the accuracy,
          relevance, timeliness, or completeness of any information on these
          external websites.
        </p>
        <h3>3.Content Changes:</h3>
        <p>
          We reserve the right to modify, update, or remove content on this
          website at any time without prior notice.
        </p>
        <h3>4.User Responsibility:</h3>
        <p>
          The use of any information on this website is at your own risk. It is
          your responsibility to ensure that any products, services, or
          information available through this website meet your specific
          requirements.{" "}
        </p>
        <h3>5.Limitation of Liability:</h3>
        <p>
          In no event will we be liable for any loss or damage, including
          without limitation, indirect or consequential loss or damage, or any
          loss or damage whatsoever arising from loss of data or profits arising
          out of, or in connection with, the use of this website.
        </p>
        <h3>6.Legal Jurisdiction:</h3>
        <p>
          This disclaimer is governed by and construed in accordance with the
          laws of [Your Jurisdiction] and you irrevocably submit to the
          exclusive jurisdiction of the courts in that location.
        </p>
        <p>
          By using this website, you agree to these terms and conditions of use.
        </p>
      </div>
      <div className="understand">
        <Button type="primary" disabled={isDisabled} onClick={understand}>
          I Understand
        </Button>
      </div>
    </Modal>
  );
}
