import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DOMAIN } from "../../utils/api";
import axios from "axios";
import { handleError } from "../../utils/error";
import { getFromStorage } from "../../utils/storage";
import { Avatar } from "@mui/material";

export default function UserProfile() {
  const token = getFromStorage("current-user")?.accessToken;
  const { userId } = useParams();
  const [user, setUser] = useState();

  const getUser = useCallback(
    async function () {
      try {
        const response = await axios({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
          url: `${DOMAIN}/user/${userId}`,
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        handleError(error);
      }
    },
    [userId, token]
  );

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <UserLayout>
      <Typography
        sx={{ fontSize: "1.5rem", fontWeight: "bold", padding: "20px 16px" }}
      >
        Thông tin tài khoản
      </Typography>
      <Card>
        <CardContent>
          {user?.photo ? (
            <Avatar
              sx={{ mr: 1, width: 120, height: 120 }}
              alt="avatar"
              src={user?.photo}
            />
          ) : (
            "Bạn chưa có ảnh đại diện"
          )}
          <Typography
            sx={{ fontSize: 20, marginBottom: "20px" }}
            gutterBottom
          ></Typography>
          <Typography sx={{ fontSize: 20, marginBottom: "20px" }} gutterBottom>
            Tên tài khoản: {user?.name}
          </Typography>
          <Typography sx={{ fontSize: 20 }} gutterBottom>
            Email: {user?.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button href={`/user/edit-profile/${userId}`} size="medium">
            Chỉnh sửa thông tin
          </Button>
        </CardActions>
      </Card>
    </UserLayout>
  );
}
