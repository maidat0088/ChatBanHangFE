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
import { DOMAIN, api } from "../utils/api";
import { useSelector } from "react-redux";
import { getFromStorage } from "../utils/storage";
import CreateOrderForm from "./CreateOrderForm";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
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

export default function CreateOrderPanel() {
  //------INIT STATE------
  const navigate = useNavigate();
  const token = getFromStorage("current-user")?.accessToken;
  const mediaMd = useMediaQuery("(min-width:768px)");
  const { currentUser } = useSelector((state) => state.currentUser);
  const [createOrders, setCreateOrders] = useState([]);
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
  }, [createOrders]);

  //------SHOW FORM------
  const handleShowForm = (boolean) => {
    setShowForm(boolean);
  };

  //------GET CREATE ORDERS------
  const getCreateOrders = useCallback(
    async function () {
      const response = await axios({
        url: api.GET_CREATE_ORDERS,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        withCredentials: true,
      });
      setCreateOrders(response.data);
    },
    [token]
  );

  useEffect(() => {
    getCreateOrders();
  }, [getCreateOrders]);

  //------SOCKET POST CREATE ORDER AND GET START PRODUCE ORDER------
  useEffect(() => {
    socket.on("get-create-order", (data) => {
      setCreateOrders((createOrders) => [...createOrders, data]);
    });
    socket.on("get-start-produce-order", (data) => {
      setCreateOrders((createOrders) =>
        createOrders.filter((order) => order._id !== data._id)
      );
    });
    return () => {
      socket.off();
    };
  }, [createOrders]);

  //------POST START PRODUCE ORDERS------
  const startProduceOrder = async function (data) {
    socket.emit("post-start-produce-order", data);
    navigate(`/user/task/1`);
    window.location.reload(true);
  };

  return (
    <Box
      maxHeight={showForm ? `${window.innerHeight - 250}px` : `${window.innerHeight - 80}px`} 
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
        {createOrders?.length > 0 &&
          createOrders?.map((item, index) => {
            return (
              <Box display="flex" key={index} sx={{ mb: 2 }}>
                <Box
                  sx={
                    item.creator.user._id === currentUser.id
                      ? { marginLeft: "auto", display: "flex" }
                      : { display: "flex" }
                  }
                >
                  <Avatar
                    sx={
                      item.creator.user._id === currentUser.id
                        ? { display: "none" }
                        : mediaMd
                        ? { mr: "10px" }
                        : { mr: "10px", width: "30px", height: "30px" }
                    }
                    alt="avatar"
                    src={item.creator.user.photo}
                  />
                  <Typography
                    onClick={() => {
                      setShowButton(!showButton);
                      setButtonIndex(index);
                    }}
                    component={"div"}
                    sx={
                      item.creator.user._id === currentUser.id
                        ? styleUserMessageWithAvatar
                        : styleOtherMessageWithAvatar
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        marginBottom: "5px",
                        color: "#4169E1",
                        fontWeight: "bold",
                      }}
                    >
                      {item.creator.user.name} đã tạo đơn hàng vào:{" "}
                      {item.creator.createdAt}
                    </Typography>
                    <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                    {item.quantity} kg <br></br>{" "}
                    <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                    {item.detail}
                    {buttonIndex === index && showButton && (
                      <Typography>
                        <Button
                          onClick={() => {
                            startProduceOrder({
                              producerId: currentUser?.id,
                              orderId: item._id,
                            });
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
                          Nhận xử lý
                        </Button>
                      </Typography>
                    )}
                  </Typography>
                  <Avatar
                    sx={
                      item.creator.user._id !== currentUser.id
                        ? { display: "none" }
                        : mediaMd
                        ? { ml: "10px" }
                        : { ml: "10px", width: "30px", height: "30px" }
                    }
                    alt="avatar"
                    src={item.creator.user.photo}
                  />
                </Box>
              </Box>
            );
          })}
        {createOrders?.length === 0 && (
          <h3 style={{ marginLeft: "20px" }}>Chưa có đơn hàng mới</h3>
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
              onClick={(e) => {
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
