import React, { useCallback, useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import FileUploadOutlined from "@mui/icons-material/FileUploadOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { DOMAIN } from "../../utils/api";
import axios from "axios";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import { useDispatch, useSelector } from "react-redux";
import { currentUserActions } from "../../redux/store";
import { handleError } from "../../utils/error";

export default function EditProfile() {
  const token = getFromStorage("current-user")?.accessToken;
  const { currentUser } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userEdit, setUserEdit] = useState({
    values: { name: "", email: "" },
    errors: { name: "", email: "" },
  });
  const [photo, setPhoto] = useState(currentUser.photo);
  const [fileUpload, setFileUpload] = useState();

  const getUser = useCallback(
    async function () {
      try {
        const response = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          url: `${DOMAIN}/user/${userId}`,
          withCredentials: true,
        });
        setUserEdit({
          values: {
            name: response.data.name,
            email: response.data.email,
          },
          errors: { name: "", email: "" },
        });
      } catch (error) {
        handleError(error);
      }
    },
    [userId, token]
  );

  const editUser = async function () {
    try {
      const response = await axios({
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        url: `${DOMAIN}/user/${userId}`,
        withCredentials: true,
        data: {
          id: userId,
          name: userEdit.values.name,
          photo: photo,
        },
      });
      saveToStorage("current-user", {
        ...response.data.userEdit,
        accessToken: token,
      });
      dispatch(currentUserActions.isLogin(response.data.userEdit));
      navigate(`/user/profile/${userId}`);
    } catch (error) {
      handleError(error);
    }
  };

  const onFileChange = async (e) => {
    setFileUpload(e.target.files[0]);
  };

  const uploadPhoto = async function () {
    const formData = new FormData();
    formData.append("image", fileUpload);
    try {
      const response = await axios({
        method: "POST",
        url: "https://api.imgbb.com/1/upload?key=2505f8c4ab5efaadef21d791160f51f0",
        data: formData,
      });
      if (response.status === 200) {
        const imageUrl = response.data.data.display_url;
        setPhoto(imageUrl);
        alert("Tải ảnh thành công!");
      }
    } catch (error) {
      alert(error.response.data.error.message);
      handleError(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    let newValue = { ...userEdit.values, [name]: value };
    let newError = { ...userEdit.errors };

    //Empty Validation
    if (name === "name") {
      if (value.trim() === "") {
        newError[name] = "* Tên tài khoản không được bỏ trống";
      } else {
        newError[name] = "";
      }
    }

    setUserEdit({ values: newValue, errors: newError });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (userEdit.errors?.email !== "" || userEdit.errors?.name !== "") {
      return;
    }
    editUser();
  };
  return (
    <UserLayout>
      <Typography
        sx={{ fontSize: "1.5rem", fontWeight: "bold", padding: "20px 16px" }}
      >
        Cập nhật thông tin
      </Typography>
      <Card>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <CardContent>
            <Avatar
              sx={{ mr: 1, width: 80, height: 80 }}
              alt="avatar"
              src={photo}
            />
            <Typography
              sx={{
                fontWeight: "bold",
                marginBottom: 1,
                marginTop: 2,
              }}
            >
              Cập nhật ảnh đại diện
            </Typography>
            <Box>
              <input type="file" onChange={onFileChange} />
            </Box>
            <Button
              size="small"
              sx={{ mt: 2, marginBottom: 2 }}
              color="success"
              startIcon={<FileUploadOutlined />}
              variant="contained"
              component="label"
              onClick={() => {
                uploadPhoto();
              }}
            >
              Tải ảnh
            </Button>
            <TextField
              value={userEdit.values?.name}
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
            <span style={{ color: "#ff0000" }}>{userEdit.errors?.name}</span>
            <TextField
              value={userEdit.values?.email}
              margin="normal"
              disabled
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
              onChange={handleChange}
            />
          </CardContent>
          <CardActions
            sx={{ display: "flex", justifyContent: "center", pb: 5, px: 2 }}
          >
            <Button fullWidth type="submit" variant="contained">
              Cập nhật hồ sơ
            </Button>
          </CardActions>
        </Box>
      </Card>
    </UserLayout>
  );
}
