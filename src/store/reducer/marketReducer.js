import { createSlice } from "@reduxjs/toolkit";

let btcPrice = localStorage.getItem("btc_usd");
export const marketSlice = createSlice({
  name: "market",
  initialState: {
    tokenList: [],
    responseTime: 0,
    btcPrice: btcPrice || 0,
  },
  reducers: {
    setTokenList(state, { payload }) {
      if (payload && Array.isArray(payload)) {
        const sortedArray = [...payload].sort((a, b) => a.id - b.id);
        state.tokenList = sortedArray;
      }
    },
    setBtcPrice(state, action) {
      state.btcPrice = action.payload;
      localStorage.setItem("btc_usd", action.payload);
    },
  },
});
export const { setTokenList, setBtcPrice } = marketSlice.actions;
export default marketSlice.reducer;
