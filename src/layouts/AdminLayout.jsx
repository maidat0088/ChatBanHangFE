import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { Fragment } from "react";
import { removeFromStorage } from "../utils/storage";
import { currentUserActions } from "../redux/store";

export default function AdminLayout(props) {
  const { currentUser } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <CssBaseline />
      <Container sx={{ background: "#2F4F4F", height: "100vh" }} maxWidth="lg">
        <Stack
          sx={{ padding: "30px 0" }}
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="end"
        >
          <Button
            color="secondary"
            variant="contained"
            href={`/admin/dashboard`}
          >
            Dashboard
          </Button>
          {!currentUser.isLoggedIn ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <Button
                  sx={{ mr: 2 }}
                  color="success"
                  variant="contained"
                  href="/signup"
                >
                  Register
                </Button>
                <Button variant="contained" href="/login">
                  Login
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <Typography component={"div"} color="white">
                Welcome back! {currentUser?.name}
              </Typography>
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
                Sign Out
              </Button>
            </div>
          )}
        </Stack>
        {props.children}
      </Container>
    </Fragment>
  );
}
