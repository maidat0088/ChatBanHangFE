import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { DOMAIN, api } from "../utils/api";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { getFromStorage } from "../utils/storage";

const styleUserMessageWithAvatar = {
  background: "#B6D0E2",
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleUserMessageWithoutAvatar = {
  background: "#B6D0E2",
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "50px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleUserMessageWithoutAvatarMobile = {
  background: "#B6D0E2",
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "40px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleOtherMessageWithAvatar = {
  background: "#fff",
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleOtherMessageWithoutAvatar = {
  background: "#fff",
  display: "inline-block",
  padding: "5px 10px",
  marginLeft: "50px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

const styleOtherMessageWithoutAvatarMobile = {
  background: "#fff",
  display: "inline-block",
  padding: "5px 10px",
  marginLeft: "40px",
  borderRadius: "15px",
  boxShadow:
    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
};

export default function ChatPanel() {
  const token = getFromStorage("current-user")?.accessToken;
  const navigate = useNavigate();
  const mediaMd = useMediaQuery("(min-width:768px)");
  const { currentUser } = useSelector((state) => state.currentUser);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState();
  const socket = io(DOMAIN);

  const getAllMessages = useCallback(
    async function () {
      const response = await axios({
        url: api.GET_MESSAGES,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        withCredentials: true,
      });
      setAllMessages(response.data);
    },
    [token]
  );

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("post-message", {
        message,
        userId: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.photo,
      });
    }
    setMessage("");
  };

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages]);

  useEffect(() => {
    socket.on("messages", (data) => {
      setAllMessages(data);
    });
    return () => {
      socket.off("messages");
    };
  }, []);

  return (
    <Card sx={mediaMd ? { paddingTop: "60px" } : { paddingTop: "40px" }}>
      <CardContent
        sx={
          mediaMd
            ? { background: "#E9EAEC", height: "100vh" }
            : {
                background: "#E9EAEC",
                height: "100vh",
                padding: "16px 8px",
              }
        }
      >
        {allMessages?.map((item, index) => {
          return (
            <Box display="flex" key={index} sx={{ mb: 1 }}>
              {allMessages[index - 1]?.userId !== allMessages[index]?.userId ? (
                <Box
                  sx={
                    item.userId === currentUser.id
                      ? { marginLeft: "auto", display: "flex" }
                      : { display: "flex" }
                  }
                >
                  <Avatar
                    sx={
                      item.userId === currentUser.id
                        ? { display: "none" }
                        : mediaMd
                        ? { mr: "10px" }
                        : { mr: "10px", width: "30px", height: "30px" }
                    }
                    alt="avatar"
                    src={item?.avatar}
                  />
                  <Typography
                    component={"div"}
                    sx={
                      item.userId === currentUser.id
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
                      {item.userId !== currentUser.id && item.name}
                    </Typography>
                    {item.message}
                  </Typography>
                  <Avatar
                    sx={
                      item.userId !== currentUser.id
                        ? { display: "none" }
                        : mediaMd
                        ? { ml: "10px" }
                        : { ml: "10px", width: "30px", height: "30px" }
                    }
                    alt="avatar"
                    src={item?.avatar}
                  />
                </Box>
              ) : (
                <Box
                  sx={
                    item.userId === currentUser.id ? { marginLeft: "auto" } : {}
                  }
                >
                  <Typography
                    sx={
                      item.userId === currentUser.id
                        ? mediaMd
                          ? styleUserMessageWithoutAvatar
                          : styleUserMessageWithoutAvatarMobile
                        : mediaMd
                        ? styleOtherMessageWithoutAvatar
                        : styleOtherMessageWithoutAvatarMobile
                    }
                  >
                    {item.message}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </CardContent>
      <Container
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, p: 0 }}
        maxWidth="lg"
      >
        <Box
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: mediaMd ? "flex-start" : "space-evenly",
            alignItems: "center",
            background: "#fff",
          }}
          noValidate
          autoComplete="off"
        >
          <IconButton
            onClick={() => {
              navigate("/user/create-order");
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
            id="input-websocket"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim() !== "") {
                socket.emit("post-message", {
                  message,
                  userId: currentUser.id,
                  name: currentUser.name,
                  avatar: currentUser.photo,
                });
                setMessage("");
              }
            }}
            value={message}
            type="text"
            placeholder="Tin nhắn"
          />

          <IconButton onClick={handleSubmit}>
            <SendIcon
              sx={{
                color: "#006C9C",
                fontSize: "30px",
                cursor: "pointer",
              }}
            />
          </IconButton>
        </Box>
      </Container>
    </Card>
  );
}
