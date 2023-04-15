import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { removeFromStorage } from "../utils/storage";
import { currentUserActions } from "../redux/store.js";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import NotificationButton from "../components/NotificationButton";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export default function ButtonAppBar() {
  const { currentUser } = useSelector((state) => state.currentUser);
  const mediaMd = useMediaQuery("(min-width:768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //------DRAWER START------

  const [state, setState] = React.useState({
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
      <List>
        <ListItem
          onClick={() => {
            navigate(`/user/profile/${currentUser.id}`);
          }}
          sx={{ background: "#006C9C", padding: "10px 16px" }}
        >
          <Avatar
            sx={{ border: "1px solid #fff", cursor: "pointer" }}
            alt="avatar"
            src={currentUser?.photo}
          />
          <Typography sx={{ marginLeft: 2, color: "#fff" }}>
            {currentUser?.name}
          </Typography>
        </ListItem>
        <Divider />

        <ListItem
          onClick={() => {
            navigate(`/user/profile/${currentUser.id}`);
          }}
        >
          <ListItemButton sx={{ paddingLeft: 0 }}>
            <ListItemIcon>
              <AccountBoxOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Hồ sơ"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => {
            navigate(`/user/task/0`);
          }}
        >
          <ListItemButton sx={{ paddingLeft: 0 }}>
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Bảng làm việc"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          onClick={() => {
            removeFromStorage("current-user");
            dispatch(currentUserActions.isLogout());
            navigate("/login");
          }}
          sx={{ background: "#B71D18", color: "#fff" }}
        >
          <ListItemButton sx={{ paddingLeft: 0 }}>
            <ListItemIcon>
              <LogoutOutlinedIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary={"Đăng xuất"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  //------DRAWER END------

  return (
    <>
      {mediaMd && (
        <AppBar sx={{ background: "#006C9C" }} position="fixed">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Button
                sx={{ mr: 2 }}
                color="success"
                variant="contained"
                href={`/user/task/0`}
              >
                Bảng làm việc
              </Button>
            </Box>
            {!currentUser.isLoggedIn ? (
              <Stack direction="row" justifyContent="center" alignItems="end">
                <Button
                  sx={{ mr: 2 }}
                  color="success"
                  variant="contained"
                  href="/signup"
                >
                  Đăng ký
                </Button>
                <Button variant="contained" href="/login">
                  Đăng nhập
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="center" alignItems="end">
                <Avatar
                  sx={{ border: "1px solid #fff", cursor: "pointer" }}
                  alt="avatar"
                  src={currentUser?.photo}
                  onClick={() => {
                    navigate(`/user/profile/${currentUser.id}`);
                  }}
                />
                <NotificationButton />
                <Button
                  sx={{ ml: 5 }}
                  onClick={() => {
                    removeFromStorage("current-user");
                    dispatch(currentUserActions.isLogout());
                  }}
                  color="error"
                  variant="contained"
                  href="/login"
                >
                  Đăng xuất
                </Button>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      )}
      {!mediaMd && (
        <AppBar sx={{ background: "#006C9C" }} position="fixed">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={"left"}
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
            >
              {list("left")}
            </Drawer>

            {!currentUser.isLoggedIn ? (
              <Stack direction="row" justifyContent="center" alignItems="end">
                <Button
                  size="medium"
                  sx={{ mr: 2 }}
                  color="success"
                  variant="contained"
                  href="/signup"
                >
                  Đăng ký
                </Button>
                <Button size="medium" variant="contained" href="/login">
                  Đăng nhập
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" justifyContent="center" alignItems="end">
                <Avatar
                  sx={{
                    border: "1px solid #fff",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                  }}
                  alt="avatar"
                  src={currentUser?.photo}
                  onClick={() => {
                    navigate(`/user/profile/${currentUser.id}`);
                  }}
                />

                <NotificationButton />
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
