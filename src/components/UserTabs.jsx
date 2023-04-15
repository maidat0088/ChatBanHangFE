import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LoopIcon from "@mui/icons-material/Loop";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Badge, useMediaQuery } from "@mui/material";
import ShippingPanel from "./ShippingPanel";
import CreateOrderPanel from "./CreateOrderPanel";
import ProduceOrderPanel from "./ProduceOrderPanel";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DOMAIN, api } from "../utils/api";
import { getFromStorage } from "../utils/storage";
import { io } from "socket.io-client";
import SuccessOrderPanel from "./SuccessOrderPanel";
const socket = io(DOMAIN);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UserTabs() {
  const navigate = useNavigate();
  const token = getFromStorage("current-user")?.accessToken;
  const { tabValue } = useParams();
  const mediaMd = useMediaQuery("(min-width:768px)");
  const min600 = useMediaQuery("(min-width:600px)");
  const [value, setValue] = useState(Number(tabValue));
  const [ordersQuantity, setOrdersQuantity] = useState();

  const getOrdersQuantity = useCallback(
    async function () {
      const response = await axios({
        url: api.GET_ORDERS_QUANTITY,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        withCredentials: true,
      });
      setOrdersQuantity(response.data);
    },
    [token]
  );

  useEffect(() => {
    getOrdersQuantity();
  }, [getOrdersQuantity]);

  useEffect(() => {
    socket.on("create-order-quantity", (data) => {
      const updateCreateOrdersQuantity = {...ordersQuantity};
      updateCreateOrdersQuantity.createOrdersQuantity = data
      setOrdersQuantity(updateCreateOrdersQuantity);
    });
    socket.on("produce-order-quantity", (data) => {
      const updateProduceOrdersQuantity = {...ordersQuantity};
      updateProduceOrdersQuantity.produceOrdersQuantity = data
      setOrdersQuantity(updateProduceOrdersQuantity);
    });
    socket.on("ship-order-quantity", (data) => {
      const updateShipOrdersQuantity = {...ordersQuantity};
      updateShipOrdersQuantity.shipOrdersQuantity = data
      setOrdersQuantity(updateShipOrdersQuantity);
    });
    socket.on("success-order-quantity", (data) => {
      const updateSuccessOrdersQuantity = {...ordersQuantity};
      updateSuccessOrdersQuantity.successOrdersQuantity = data
      setOrdersQuantity(updateSuccessOrdersQuantity);
    });
    return () => {
      socket.off();
    };
  }, [ordersQuantity]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", color: "#000" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            position: "fixed",
            zIndex: "999",
            background: "#fff",
            top: min600 ? "64px" : "56px",
            left: 0,
            right: 0,
          }}
        >
          <Tab
            onClick={() => {
              navigate("/user/task/0");
            }}
            icon={
              <Badge
                badgeContent={ordersQuantity?.createOrdersQuantity}
                color="success"
              >
                <ShoppingCartIcon />
              </Badge>
            }
            iconPosition="start"
            sx={{ color: "#000" }}
            label={mediaMd ? "Tạo đơn hàng" : ""}
            {...a11yProps(0)}
          />
          <Tab
            onClick={() => {
              navigate("/user/task/1");
            }}
            icon={
              <Badge
                badgeContent={ordersQuantity?.produceOrdersQuantity}
                color="success"
              >
                <LoopIcon />
              </Badge>
            }
            iconPosition="start"
            sx={{ color: "#000" }}
            label={mediaMd ? "Xử lý đơn hàng" : ""}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              navigate("/user/task/2");
            }}
            icon={
              <Badge
                badgeContent={ordersQuantity?.shipOrdersQuantity}
                color="success"
              >
                <LocalShippingIcon />
              </Badge>
            }
            iconPosition="start"
            sx={{ color: "#000" }}
            label={mediaMd ? "Giao hàng" : ""}
            {...a11yProps(2)}
          />
          <Tab
            onClick={() => {
              navigate("/user/task/3");
            }}
            icon={
              <Badge
                badgeContent={ordersQuantity?.successOrdersQuantity}
                color="success"
              >
                <DoneOutlineIcon />
              </Badge>
            }
            iconPosition="start"
            sx={{ color: "#000" }}
            label={mediaMd ? "Thành công" : ""}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CreateOrderPanel />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProduceOrderPanel />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ShippingPanel />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SuccessOrderPanel />
      </TabPanel>
    </Box>
  );
}
