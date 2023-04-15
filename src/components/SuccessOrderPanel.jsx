import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DOMAIN, api } from "../utils/api";
import { handleError } from "../utils/error";
import { getFromStorage } from "../utils/storage";
import CreateOrderForm from "./CreateOrderForm";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/AddCircle";
import { io } from "socket.io-client";
import CreateOrderForm2 from "./CreateOrderForm2";
const socket = io(DOMAIN);

const styleUserMessageWithAvatar = {
  cursor: "pointer",
  background: "#B6D0E2",
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleOtherMessageWithAvatar = {
  cursor: "pointer",
  background: "#fff",
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

export default function SuccessOrderPanel() {
  //------INIT STATE------
  const mediaMd = useMediaQuery("(min-width:768px)");
  const { currentUser } = useSelector((state) => state.currentUser);
  const token = getFromStorage("current-user")?.accessToken;
  const [successOrders, setSuccessOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  //------SCROLL TO BOTTOM------
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [successOrders]);

  //------SHOW FORM------
  const handleShowForm = (boolean) => {
    setShowForm(boolean);
  };

  //------GET SHIP ORDERS------
  const getSuccessOrders = useCallback(
    async function () {
      try {
        const response = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: api.GET_SUCCESS_ORDERS,
          withCredentials: true,
        });
        setSuccessOrders(response.data);
      } catch (error) {
        handleError(error);
      }
    },
    [token]
  );

  useEffect(() => {
    getSuccessOrders();
  }, [getSuccessOrders]);

  //------SOCKET GET SUCCESS ORDER------
  useEffect(() => {
    socket.on("get-end-ship-order", (data) => {
      setSuccessOrders((successOrders) => [...successOrders, data]);
    });
    return () => {
      socket.off();
    };
  }, [successOrders]);

  return (
    <Box
      maxHeight="700px"
      overflow="auto"
      sx={
        mediaMd
          ? {
              padding: "150px 20px 60px 20px",
              background: "#E9EAEC",
            }
          : {
              padding: "130px 10px 60px 10px",
              background: "#E9EAEC",
            }
      }
    >
      <Box>
        {successOrders?.map((item, index) => {
          return (
            <Box key={index}>
              {item.shipper.user._id !== currentUser.id &&
                item.shipper.shipEnd && (
                  <Box display="flex" key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex" }}>
                      <Avatar
                        sx={
                          mediaMd
                            ? { mr: "10px" }
                            : { mr: "10px", width: "30px", height: "30px" }
                        }
                        alt="avatar"
                        src={item.shipper.user.photo}
                      />
                      <Typography
                        component={"div"}
                        sx={styleOtherMessageWithAvatar}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            marginBottom: "5px",
                            color: "#2E5F20",
                            fontWeight: "bold",
                          }}
                        >
                          {item.shipper.user.name} đã giao hàng vào:{" "}
                          {item.shipper.shipEnd}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                        {item.quantity} kg <br></br>{" "}
                        <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                        {item.detail}
                        <Typography
                          sx={{ color: "#2E5F20", fontWeight: "bold" }}
                        >
                          ĐƠN HÀNG GIAO THÀNH CÔNG!
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                )}
              {item.shipper.user._id === currentUser.id &&
                item.shipper.shipEnd && (
                  <Box display="flex" key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", marginLeft: "auto" }}>
                      <Typography
                        component={"div"}
                        sx={styleUserMessageWithAvatar}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            marginBottom: "5px",
                            color: "#2E5F20",
                            fontWeight: "bold",
                          }}
                        >
                          {item.shipper.user.name} đã giao hàng vào:{" "}
                          {item.shipper.shipEnd}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                        {item.quantity} kg <br></br>{" "}
                        <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                        {item.detail}
                        <Typography
                          sx={{ color: "#2E5F20", fontWeight: "bold" }}
                        >
                          ĐƠN HÀNG GIAO THÀNH CÔNG!
                        </Typography>
                      </Typography>
                      <Avatar
                        sx={
                          mediaMd
                            ? { ml: "10px" }
                            : { ml: "10px", width: "30px", height: "30px" }
                        }
                        alt="avatar"
                        src={item.shipper.user.photo}
                      />
                    </Box>
                  </Box>
                )}
            </Box>
          );
        })}
        {successOrders?.length === 0 && (
          <h3 style={{ marginLeft: "20px" }}>Chưa có đơn hàng thành công</h3>
        )}
      </Box>
      <Box ref={messagesEndRef}></Box>

      <Box
        sx={{
          margin: "0 auto",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 0,
        }}
        noValidate
        autoComplete="off"
      >
        {showForm && <CreateOrderForm2 handleShowForm={handleShowForm} />}
        {!showForm && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
            }}
          >
            <IconButton
              onClick={() => {
                setShowForm(true);
              }}
            >
              <AddIcon
                sx={{
                  color: "#006C9C",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
            <input
              onClick={() => {
                setShowForm(true);
              }}
              id="input-websocket"
              type="text"
              placeholder="Tạo đơn hàng"
            />
            <IconButton
              onClick={() => {
                setShowForm(true);
              }}
            >
              <SendIcon
                sx={{
                  color: "#006C9C",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
