import { Box } from "@mui/material";
import Header from "./Header";

export default function UserLayout(props) {
  return (
    <>
      <Header />
      <Box>
        {props.children}
      </Box>
    </>
  );
}
