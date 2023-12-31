import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import marketReducer from "./reducer/marketReducer";

export default configureStore({
  reducer: {
    user: userReducer,
    market: marketReducer,
  },
});
