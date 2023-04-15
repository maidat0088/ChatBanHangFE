/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Fragment, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { DOMAIN, api } from "../utils/api";
import axios from "axios";
import { handleError } from "../utils/error";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export default function NotificationButton() {
  const notificationStorage = getFromStorage("notification-quantity");
  const navigate = useNavigate();
  const token = getFromStorage("current-user")?.accessToken;
  const [notificationQuantity, setNotificationQuantity] =
    useState(notificationStorage);

  const socket = io(DOMAIN);
  const [notifications, setNotifications] = useState();

  const getNotifications = useCallback(
    async function () {
      try {
        const response = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: api.GET_NOTIFICATIONS,
          withCredentials: true,
        });
        setNotifications(response.data);
      } catch (error) {
        handleError(error);
      }
    },
    [token]
  );

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    socket.on("add-create-order-noti", (data) => {
      setNotificationQuantity(
        (notificationQuantity) => notificationQuantity + data
      );
      saveToStorage("notification-quantity", notificationQuantity + data);
    });
    socket.on("add-new-create-order-noti", (data) => {
      const newNotification = [...notifications];
      newNotification.unshift(data);
      setNotifications(newNotification);
    });
    return () => {
      socket.off();
    };
  }, [notificationQuantity, notifications]);

  //------DRAWER START------

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography
          onClick={toggleDrawer("right", true)}
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            padding: "10px",
          }}
        >
          Thông báo
        </Typography>
        <IconButton sx={{ marginRight: 2 }}>
          <NotificationsIcon sx={{ color: "#006C9C" }} />
        </IconButton>
      </Box>
      <List
        sx={{
          bgcolor: "background.paper",
          paddingLeft: "10px",
        }}
      >
        {notifications?.slice(0, 10).map((item, index) => {
          return (
            <Fragment key={index}>
              <ListItem
                onClick={() => {
                  saveToStorage("notification-quantity", 0);
                  navigate(`/user/task/0`);
                  window.location.reload(true);
                }}
                sx={{ paddingRight: 0, paddingLeft: 0 }}
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  <Avatar alt="user-name" src={item.avatar} />
                </ListItemAvatar>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                  }}
                >
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                  >
                    {item.userName}
                  </Typography>
                  {item.content}
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                  >
                    {item.createdAt}
                  </Typography>
                </Typography>
              </ListItem>
              <Divider />
            </Fragment>
          );
        })}
      </List>
    </Box>
  );

  //------DRAWER END------

  return (
    <>
      <Badge
        sx={{ mr: 1 }}
        badgeContent={notificationQuantity}
        color="error"
        onClick={toggleDrawer("right", true)}
      >
        <NotificationsIcon sx={{ color: "#fff", ml: 3, cursor: "pointer" }} />
      </Badge>
      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </>
  );
}
