import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { saveToStorage } from "../../utils/storage";
import { currentUserActions } from "../../redux/store";
import { useDispatch } from "react-redux";

const theme = createTheme();

export default function AdminSignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUser = async function (data) {
    try {
      const response = await axios({
        method: "POST",
        url: api.LOGIN,
        data,
        withCredentials: true,
      });
      if (response.data.user.role !== "admin") {
        alert("Bạn không có quyền truy cập");
        return;
      }
      saveToStorage("current-user", response.data.user);
      dispatch(currentUserActions.isLogin(response.data.user));
      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    loginUser(loginData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Đăng nhập trang người dùng"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
