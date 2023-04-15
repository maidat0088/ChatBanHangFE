import { Box, Button, Container, CssBaseline, TextField } from "@mui/material";
import React, { useState } from "react";
import { DOMAIN } from "../utils/api";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io(DOMAIN);

export default function CreateOrderForm(props) {
  //------INIT STATE------

  const { currentUser } = useSelector((state) => state.currentUser);
  const [orderData, setOrderData] = useState({
    values: {
      quantity: "",
      detail: "",
    },
    errors: {
      quantity: "",
      detail: "",
    },
  });

  //------HANDLE CHANGE FORM VALUE------
  const handleChange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...orderData.values, [name]: value };
    let newError = { ...orderData.errors };

    if (name === "quantity") {
      if (value.trim() === "" && value <= 0) {
        newError[name] = "* Khối lượng phải lớn hơn 0!";
      } else {
        newError[name] = "";
      }
    }

    if (name === "detail") {
      if (value.trim() === "") {
        newError[name] = "* Thông tin không được để trống!";
      } else {
        if (value.length < 5) {
          newError[name] = "* Thông tin tối thiểu 5 ký tự!";
        } else {
          newError[name] = "";
        }
      }
    }

    setOrderData({ values: newValue, errors: newError });
  };

  //---SOCKET START POST CREATE ORDER------
  const handleSubmit = async (event) => {
    event.preventDefault();
    const quantity = orderData.values.quantity;
    const detail = orderData.values.detail;

    if (
      orderData.errors.quantity !== "" ||
      orderData.errors.detail !== "" ||
      quantity === "" ||
      detail === ""
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const createOrderData = {
      quantity,
      detail,
      creator: currentUser,
    };
    socket.emit("post-create-order", createOrderData);
    setOrderData({
      values: {
        quantity: "",
        detail: "",
      },
      errors: {
        quantity: "",
        detail: "",
      },
    });
    props.handleShowForm(false);
  };

  return (
    <Container sx={{ background: "#E9EAEC", border: "1px solid #006C9C" }}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {orderData.errors.quantity === "" ? (
            <TextField
              type="number"
              inputMode="decimal"
              value={orderData.values.quantity}
              sx={{ background: "#fff" }}
              margin="normal"
              required
              fullWidth
              id="quantity"
              label="Khối lượng (kg)"
              name="quantity"
              autoComplete="quantity"
              autoFocus
              onChange={handleChange}
            />
          ) : (
            <TextField
              inputMode="decimal"
              value={orderData.values.quantity}
              sx={{ background: "#fff" }}
              margin="normal"
              error
              required
              fullWidth
              id="quantity"
              label="Khối lượng (kg)"
              name="quantity"
              autoComplete="quantity"
              autoFocus
              onChange={handleChange}
            />
          )}
          <span style={{ color: "#ff0000" }}>{orderData.errors.quantity}</span>

          {orderData.errors.detail === "" ? (
            <TextField
              value={orderData.values.detail}
              sx={{ background: "#fff" }}
              margin="normal"
              required
              fullWidth
              name="detail"
              label="Thông tin"
              id="outlined-multiline-flexible"
              multiline
              autoComplete="detail"
              onChange={handleChange}
            />
          ) : (
            <TextField
              value={orderData.values.detail}
              sx={{ background: "#fff" }}
              margin="normal"
              error
              required
              fullWidth
              name="detail"
              label="Thông tin"
              id="outlined-multiline-flexible"
              multiline
              autoComplete="detail"
              onChange={handleChange}
            />
          )}
          <span style={{ color: "#ff0000" }}>{orderData.errors.detail}</span>

          <Box
            sx={{
              display: "flex",
            }}
          >
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{ mt: 3, mb: 2, mr: 1, width: "70%" }}
            >
              Tạo đơn hàng
            </Button>
            <Button
              color="error"
              variant="contained"
              sx={{ mt: 3, mb: 2, width: "30%" }}
              onClick={() => {
                props.handleShowForm(false);
              }}
            >
              Thoát
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
