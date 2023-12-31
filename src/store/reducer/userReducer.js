import { createSlice } from "@reduxjs/toolkit";
import { nip19 } from "nostr-tools";
let localNostrAccount = localStorage.getItem("nostrAccount");
export const userSlice = createSlice({
  name: "user",
  initialState: {
    nostrAccount: localNostrAccount || "",
    npubNostrAccount: localNostrAccount
      ? nip19.npubEncode(localNostrAccount)
      : "",

    balanceList: {},
  },
  reducers: {
    initNostrAccount(state, action) {
      state.nostrAccount = action.payload;
      state.npubNostrAccount = action.payload
        ? nip19.npubEncode(action.payload)
        : "";
    },
    setBalanceList(state, action) {
      state.balanceList = action.payload;
    },
  },
});

export const { initNostrAccount, setBalanceList } = userSlice.actions;
export default userSlice.reducer;
