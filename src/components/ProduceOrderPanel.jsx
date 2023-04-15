import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { DOMAIN, api } from "../utils/api";
import { handleError } from "../utils/error";
import { getFromStorage } from "../utils/storage";
import { useSelector } from "react-redux";
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

export default function ProduceOrderPanel() {
  //------INIT STATE------
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.currentUser);
  const token = getFromStorage("current-user")?.accessToken;
  const mediaMd = useMediaQuery("(min-width:768px)");
  const [produceOrders, setProduceOrders] = useState([]);
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
  }, [produceOrders]);

  //------SHOW FORM------
  const handleShowForm = (boolean) => {
    setShowForm(boolean);
  };

  //------GET PRODUCE ORDERS------
  const getProduceOrders = useCallback(
    async function () {
      try {
        const response = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: api.GET_PRODUCE_ORDERS,
          withCredentials: true,
        });
        setProduceOrders(response.data);
      } catch (error) {
        handleError(error);
      }
    },
    [token]
  );

  useEffect(() => {
    getProduceOrders();
  }, [getProduceOrders]);

  //------SOCKET GET PRODUCE ORDER------
  useEffect(() => {
    socket.on("get-start-produce-order", (data) => {
      setProduceOrders((produceOrders) => [...produceOrders, data]);
    });
    socket.on("get-end-produce-order", (data) => {
      const index = produceOrders.findIndex((order) => order._id === data._id);
      const updateProduceOrders = [...produceOrders];
      updateProduceOrders[index] = data;
      setProduceOrders(updateProduceOrders);
    });
    socket.on("get-start-ship-order", (data) => {
      setProduceOrders((produceOrders) =>
        produceOrders.filter((order) => order._id !== data._id)
      );
    });
    return () => {
      socket.off();
    };
  }, [produceOrders]);

  //------POST END PRODUCE ORDERS------
  const endProduceOrder = async function (data) {
    socket.emit("post-end-produce-order", data);
  };

  //------POST START SHIP ORDERS------
  const startShipOrder = async function (data) {
    socket.emit("post-start-ship-order", data);
    navigate(`/user/task/2`);
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
        {produceOrders?.length > 0 &&
          produceOrders?.map((item, index) => {
            return (
              <Box key={index}>
                {item.producer.user._id === currentUser.id &&
                  !item.producer.produceEnd && (
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
                            {item.producer.user.name} đã nhận xử lý đơn hàng
                            vào: {item.producer.produceStart}
                          </Typography>
                          <span style={{ fontWeight: "bold" }}>
                            Khối lượng:
                          </span>{" "}
                          {item.quantity} kg <br></br>{" "}
                          <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                          {item.detail}
                          {buttonIndex === index && showButton && (
                            <Typography>
                              <Button
                                onClick={() => {
                                  endProduceOrder({ orderId: item._id });
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
                                Hoàn thành xử lý
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
                          src={item.producer.user.photo}
                        />
                      </Box>
                    </Box>
                  )}
                {item.producer.user._id !== currentUser.id &&
                  !item.producer.produceEnd && (
                    <Box display="flex" key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex" }}>
                        <Avatar
                          sx={
                            mediaMd
                              ? { mr: "10px" }
                              : { mr: "10px", width: "30px", height: "30px" }
                          }
                          alt="avatar"
                          src={item.producer.user.photo}
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
                            {item.producer.user.name} đang xử lý đơn hàng từ:{" "}
                            {item.producer.produceStart}
                          </Typography>
                          <span style={{ fontWeight: "bold" }}>
                            Khối lượng:
                          </span>{" "}
                          {item.quantity} kg <br></br>{" "}
                          <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                          {item.detail}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                {item.producer.produceEnd && (
                  <Box display="flex" key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex" }}>
                      <Avatar
                        sx={
                          mediaMd
                            ? { mr: "10px" }
                            : { mr: "10px", width: "30px", height: "30px" }
                        }
                        alt="avatar"
                        src={item.producer.user.photo}
                      />
                      <Typography
                        onClick={() => {
                          setShowButton(!showButton);
                          setButtonIndex(index);
                        }}
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
                          {item.producer.user.name} đã hoàn thành xử lý đơn hàng
                          vào: {item.producer.produceEnd}
                        </Typography>
                        <span style={{ fontWeight: "bold" }}>Khối lượng:</span>{" "}
                        {item.quantity} kg <br></br>{" "}
                        <span style={{ fontWeight: "bold" }}>Thông tin:</span>{" "}
                        {item.detail}
                        {buttonIndex === index && showButton && (
                          <Typography>
                            <Button
                              onClick={() => {
                                startShipOrder({
                                  shipId: currentUser?.id,
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
                              color="success"
                              variant="contained"
                              size="small"
                            >
                              Nhận giao hàng
                            </Button>
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        {produceOrders?.length === 0 && (
          <h3 style={{ marginLeft: "20px" }}>Chưa có đơn hàng đang xử lý</h3>
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
