import { useDispatch } from "react-redux";
import { initNostrAccount } from "../store/reducer/userReducer";

export default function useGetNostrAccount() {
  const dispatch = useDispatch();

  const handleGetNostrAccount = async () => {
    if (!window.nostr) {
      window.$notification.warning({
        message: "Install the Okx web3 wallet extension on your Chrome",
        description: (
          <span>
            {`Okx web wallet manages your Nostr keys, and you can use your key to sign it.`}
            {
              <a
                className="nostr-swap-link__notice"
                href="https://chromewebstore.google.com/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/mcohilncbfahbmgdjkbpemcciiolgcge"
                target="_blank"
              >
                Install now
              </a>
            }
          </span>
        ),
      });
      return;
    }
    let nostrAccount = "";
    let error = "";
    try {
      nostrAccount = await window.nostr.getPublicKey();
      if (nostrAccount) {
        dispatch(initNostrAccount(nostrAccount));
        localStorage.setItem("nostrAccount", nostrAccount);
      }
    } catch (e) {
      error = e;
    }
    return nostrAccount || error;
  };
  return { handleGetNostrAccount };
}
