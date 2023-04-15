import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledTitle = styled.h1`
  color: #fff;
  display: inline-block;
  padding: 5px 20px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #003768;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const StyledMobileTitle = styled.h3`
  color: #fff;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: #003768;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
export default function Title(props) {
  const mediaMd = useMediaQuery("(min-width:768px)");

  return (
    <Box style={{ textAlign: "center" }}>
      {mediaMd ? (
        <StyledTitle>{props.children}</StyledTitle>
      ) : (
        <StyledMobileTitle>{props.children}</StyledMobileTitle>
      )}
    </Box>
  );
}
