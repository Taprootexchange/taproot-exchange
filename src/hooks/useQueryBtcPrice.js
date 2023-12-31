import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBtcPrice } from "@/store/reducer/marketReducer";
import { limitDecimals } from "@/lib/numbers";
export async function useQueryBtcPrice() {
  const dispatch = useDispatch();
  if (localStorage.getItem("btc_usd_date") == new Date().getDate()) return;

  let res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: {
      ids: "bitcoin",
      vs_currencies: "usd",
    },
  });

  if (res.data && res.data.bitcoin && res.data.bitcoin.usd) {
    localStorage.setItem("btc_usd_date", new Date().getDate());
    dispatch(setBtcPrice(res.data.bitcoin.usd));
  }
}

export function useGetUsdPrice() {
  let btcPrice = useSelector(({ market }) => market.btcPrice);
  let satsUsdPrice = btcPrice / 100000000;
  function getUsdPrice(sats, maxDecimals = 2) {
    if (sats === undefined || sats === null) return "$" + 0;
    return "$" + limitDecimals(sats * satsUsdPrice, maxDecimals);
  }
  return { getUsdPrice };
}
