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
import { useState } from "react";
import UserLayout from "../layouts/UserLayout";

export default function SignUp() {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    values: {
      name: "",
      email: "",
      password: "",
    },
    errors: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...signUpData.values, [name]: value };
    let newError = { ...signUpData.errors };

    //Name Validation
    if (name === "name")
      if (value.trim() === "") {
        newError[name] = "* Tên tài khoản không được để trống!";
      } else {
        newError[name] = "";
      }

    //Email Validation
    if (name === "email") {
      const regexEmail =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
      if (!regexEmail.test(value) && value.length > 0) {
        newError[name] = "* Email không hợp lệ!";
      } else if (value.trim() === "") {
        newError[name] = "* Email không được để trống!";
      } else {
        newError[name] = "";
      }
    }

    //Password Validation
    if (name === "password") {
      const regexPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regexPassword.test(value) && value.length > 0) {
        newError[name] =
          "* Mật khẩu tối thiểu 8 ký tự, 1 ký tự in hoa, 1 ký tự đặc biệt!";
      } else if (value.trim() === "") {
        newError[name] = "* Mật khẩu không được để trống!";
      } else {
        newError[name] = "";
      }
    }

    setSignUpData({ values: newValue, errors: newError });
  };

  const registerUser = async function (data) {
    try {
      const response = await axios({
        method: "POST",
        url: api.SIGNUP,
        data,
      });
      alert(response.data.message);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //Checking input errors
    if (
      signUpData.errors.email !== "" ||
      signUpData.errors.name !== "" ||
      signUpData.errors.password !== ""
    ) {
      return;
    }

    const name = signUpData.values.name;
    const email = signUpData.values.email;
    const password = signUpData.values.password;

    const registerData = {
      name,
      email,
      password,
    };
    registerUser(registerData);
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
            {signUpData.errors.name === "" ? (
              <TextField
                sx={{ background: "#fff" }}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Tên tài khoản"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleChange}
              />
            ) : (
              <TextField
                sx={{ background: "#fff" }}
                error
                margin="normal"
                required
                fullWidth
                id="name"
                label="Tên tài khoản"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={handleChange}
              />
            )}
            <span style={{ color: "#ff0000" }}>{signUpData.errors.name}</span>
            {signUpData.errors.email === "" ? (
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
                onChange={handleChange}
              />
            ) : (
              <TextField
                sx={{ background: "#fff" }}
                margin="normal"
                error
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
            )}
            <span style={{ color: "#ff0000" }}>{signUpData.errors.email}</span>

            {signUpData.errors.password === "" ? (
              <TextField
                sx={{ background: "#fff" }}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
            ) : (
              <TextField
                sx={{ background: "#fff" }}
                margin="normal"
                error
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
            )}
            <span style={{ color: "#ff0000" }}>
              {signUpData.errors.password}
            </span>

            <Button
              type="submit"
              color="primary"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Bạn đã có tài khoản? Đăng nhập"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </UserLayout>
  );
}
