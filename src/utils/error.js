import { removeFromStorage } from "./storage";

export const handleError = function (error) {
  if (error.response.status === 401 || error.response.status === 403) {
    alert(error.response.data.message);
    removeFromStorage("current-user");
  }
};
