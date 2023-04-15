import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getFromStorage } from "../utils/storage";

const currentUser = getFromStorage("current-user");

const initialState = {
  currentUser: {
    isLoggedIn: currentUser !== null ? true : false,
    id: currentUser?.id,
    name: currentUser?.name,
    email: currentUser?.email,
    photo: currentUser?.photo,
    role: currentUser?.role,
  },
};

const currentUserSlice = createSlice({
  name: "current user",
  initialState,
  reducers: {
    isLogin(state, action) {
      state.currentUser = {
        isLoggedIn: true,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        photo: action.payload.photo,
        role: action.payload.role,
      };
    },
    isLogout(state) {
      state.currentUser = {
        isLoggedIn: false,
        id: "",
        name: "",
        email: "",
        photo: "",
        role: "",
      };
    },
  },
});

const orderForm = {
  orderQuantity: '',
  orderInformation: ''
}

const orderFormSlice = createSlice({
  name: "orderForm",
  initialState: orderForm,
  reducers: {
    setOrder(state, action) {
      const { orderQuantity, orderInformation } = action.payload;
      state.orderQuantity = orderQuantity;
      state.orderInformation = orderInformation;
    },
  },
});

const store = configureStore({
  reducer: {
    currentUser: currentUserSlice.reducer,
    orderForm: orderFormSlice.reducer
  },
});

export const currentUserActions = currentUserSlice.actions;
export const orderFormActions = orderFormSlice.actions;

export default store;
