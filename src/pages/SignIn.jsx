import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import axios from "axios";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { saveToStorage } from "../utils/storage";
import { useDispatch } from "react-redux";
import { currentUserActions } from "../redux/store";
import UserLayout from "../layouts/UserLayout";

export default function SignIn() {
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
      if (response.data.user.role !== "user") {
        alert("Bạn không có quyền truy cập");
        return;
      }
      saveToStorage("current-user", response.data.user);
      dispatch(currentUserActions.isLogin(response.data.user));
      navigate(`/user/task/0`);
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
    <UserLayout>
      <Container sx={{ marginTop: "70px" }} maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              sx={{ background: "#fff" }}
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
              sx={{ background: "#fff" }}
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
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Quên mật khẩu?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Bạn chưa có tài khoản? Đăng ký"}
                </Link>
              </Grid>
            </Grid>
            <Grid sx={{ marginTop: "20px" }} container justifyContent="center">
              <Grid item>
                <Link href="/admin/login" variant="body2">
                  {"Đăng nhập trang quản trị"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </UserLayout>
  );
}
