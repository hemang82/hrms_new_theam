import { configureStore } from "@reduxjs/toolkit";
import MasterSlice from "./slices/MasterSlice";

const store = configureStore({
    reducer: {
        masterslice: MasterSlice,
    },
});

export default store;
