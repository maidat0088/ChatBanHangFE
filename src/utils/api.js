// export const DOMAIN = 'https://websocket-be-production.up.railway.app';

export const DOMAIN = 'https://chatbanhangbe-production.up.railway.app';

// export const DOMAIN = 'http://localhost:5000';

export const api = {
  LOGIN: `${DOMAIN}/login`,
  SIGNUP: `${DOMAIN}/signup`,
  GET_MESSAGES: `${DOMAIN}/chat`,
  GET_NOTIFICATIONS: `${DOMAIN}/notification`,
  GET_ORDERS: `${DOMAIN}/orders`,
  GET_ORDERS_QUANTITY: `${DOMAIN}/orders/quantity`,
  GET_CREATE_ORDERS: `${DOMAIN}/orders/create`,
  GET_PRODUCE_ORDERS: `${DOMAIN}/orders/produce`,
  GET_SHIP_ORDERS: `${DOMAIN}/orders/ship`,
  GET_SUCCESS_ORDERS: `${DOMAIN}/orders/success`,
  POST_CREATE_ORDER: `${DOMAIN}/order/create`,
  POST_START_PRODUCE_ORDER: `${DOMAIN}/order/start-produce`,
  POST_END_PRODUCE_ORDER: `${DOMAIN}/order/end-produce`,
  POST_START_SHIP_ORDER: `${DOMAIN}/order/start-ship`,
  POST_END_SHIP_ORDER: `${DOMAIN}/order/end-ship`,
}
