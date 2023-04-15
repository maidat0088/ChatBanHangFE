import {
  Avatar,
  Box,
  Button,
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
import { useNavigate } from "react-router-dom";
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

export default function ShippingPanel() {
  //------INIT STATE------
  const navigate = useNavigate();
  const mediaMd = useMediaQuery("(min-width:768px)");
  const { currentUser } = useSelector((state) => state.currentUser);
  const token = getFromStorage("current-user")?.accessToken;
  const [shipOrders, setShipOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();
  const [showButton, setShowButton] = useState(false);

  //------SCROLL TO BOTTOM------
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [shipOrders]);

  //------SHOW FORM------
  const handleShowForm = (boolean) => {
    setShowForm(boolean);
  };

  //------GET SHIP ORDERS------
  const getShipOrders = useCallback(
    async function () {
      try {
        const response = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: api.GET_SHIP_ORDERS,
          withCredentials: true,
        });
        setShipOrders(response.data);
      } catch (error) {
        handleError(error);
      }
    },
    [token]
  );

  useEffect(() => {
    getShipOrders();
  }, [getShipOrders]);

  //------SOCKET GET SHIP ORDER------
  useEffect(() => {
    socket.on("get-start-ship-order", (data) => {
      setShipOrders((shipOrders) => [...shipOrders, data]);
    });
    socket.on("get-end-ship-order", (data) => {
      setShipOrders((shipOrders) =>
        shipOrders.filter((order) => order._id !== data._id)
      );
    });
    return () => {
      socket.off();
    };
  }, [shipOrders]);

  //------POST END SHIP ORDERS------
  const endShipOrder = async function (data) {
    socket.emit("post-end-ship-order", data);
    navigate(`/user/task/3`);
    window.location.reload(true);
  };

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
        {shipOrders?.map((item, index) => {
          return (
            <Box key={index}>
              {item.shipper.user._id === currentUser.id &&
                !item.shipper.shipEnd && (
                  <Box display="flex" key={index} sx={{ mb: 2 }}>
                    <Box sx={{ marginLeft: "auto", display: "flex" }}>
                      <Typography
                        onClick={() => {
                          setShowButton(!showButton);
                          setButtonIndex(index);
                        }}
                        component={"div"}
                        sx={styleUserMessageWithAvatar}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            marginBottom: "5px",
                            color: "#4169E1",
                            fontWeight: "bold",
                          }}
                        >
                          {item.shipper.user.name} đã nhận giao hàng vào:{" "}
                          {item.shipper.shipStart}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                        {item.quantity} kg <br></br>{" "}
                        <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                        {item.detail}
                        {buttonIndex === index && showButton && (
                          <Typography>
                            <Button
                              onClick={() => {
                                endShipOrder({ orderId: item._id });
                              }}
                              sx={{
                                textTransform: "none",
                                fontSize: "10px",
                                padding: "2px 5px",
                                minWidth: 0,
                                lineHeight: "0.7rem",
                              }}
                              variant="contained"
                              size="small"
                            >
                              Hoàn thành giao hàng
                            </Button>
                          </Typography>
                        )}
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
              {item.shipper.user._id !== currentUser.id &&
                !item.shipper.produceEnd && (
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
                            color: "#4169E1",
                            fontWeight: "bold",
                          }}
                        >
                          {item.shipper.user.name} đang giao hàng từ:{" "}
                          {item.shipper.shipStart}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                        {item.quantity} kg <br></br>{" "}
                        <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                        {item.detail}
                      </Typography>
                    </Box>
                  </Box>
                )}
            </Box>
          );
        })}
        {shipOrders?.length === 0 && (
          <h3 style={{ marginLeft: "20px" }}>Chưa có đơn hàng đang giao</h3>
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
