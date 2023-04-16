import React, { useState, useRef, useCallback, useEffect } from "react";
import { DOMAIN } from "../utils/api";
import {
    FormControl,
    InputAdornment,
    Stack,
    TextField,
    styled
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { orderFormActions } from "../redux/store";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
const socket = io(DOMAIN);

const OrderTextField = styled(TextField)({
    '& label.Mui-focused': {

    },
    '& .MuiInput-underline:after': {

    },
    '& .MuiOutlinedInput-root': {
        height: '40px',
        '& fieldset': {
            borderColor: '#e9eaec',
        },
        '&:hover fieldset': {
            borderColor: '#006c9c',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#006c9c',
        },
    },
});

const CreateOrderForm2 = (props) => {
    const { handleShowForm } = props
    const orderQuantityRef = useRef();
    const orderDetailRef = useRef();

    const orderForm = useSelector((state) => state.orderForm);
    const { currentUser } = useSelector((state) => state.currentUser);
    const dispatch = useDispatch();

    const handleOrderQuantityEnter = (event) => {
        if (event.key === 'Enter' || event.key === 13) {
            orderDetailRef?.current?.focus()
        }
    };

    const handleOrderDetailEnter = (event) => {
        if (event.key === 'Enter' || event.key === 13) {
            const quantity = orderQuantityRef.current.value.trim();
            const detail = orderDetailRef.current.value.trim();

            if (quantity === ""
                || detail === ""
                || isNaN(quantity)
                || quantity <= 0
                || detail.length < 5) {
                orderQuantityRef.current.focus();
                return;
            }

            handleSubmit(quantity, detail)

            dispatch(orderFormActions.setOrder({
                "orderQuantity": '',
                "orderInformation": ''
            }));

            handleShowForm(false);
        }
    }

    const handleSubmit = async (_quantity, _detail) => {
        const quantity = Number(_quantity);
        const detail = _detail.toString();
        const createOrderData = {
            quantity,
            detail,
            creator: currentUser,
        };
        socket.emit("post-create-order", createOrderData);
    };

    const handleClickAway = () => {
        if (orderQuantityRef.current.value.toString() !== orderForm.orderQuantity.toString()
            || orderQuantityRef.current.value.toString() !== orderForm.orderInformation.toString()) {
            dispatch(orderFormActions.setOrder({
                "orderQuantity": orderQuantityRef.current.value,
                "orderInformation": orderDetailRef.current.value
            }));
        }
        handleShowForm(false)
    };

    return (

        <ClickAwayListener onClickAway={handleClickAway} mouseEvent='onClick'>
            <Stack alignItems='center' sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fff",
            }}  >
                <FormControl sx={{ width: '85%', paddingTop: '15px', paddingBottom: '15px' }}    >
                    <OrderTextField
                        id="input-with-icon-textfield"
                        placeholder="Khối lượng"
                        type="number"
                        autoFocus
                        defaultValue={orderForm?.orderQuantity}
                        inputRef={orderQuantityRef}
                        onKeyDown={handleOrderQuantityEnter}
                        sx={
                            {
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderRadius: '15px 15px 0px 0px',
                                        borderBottomWidth: '0.5px',
                                    },
                                },
                            }
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <p style={{ fontSize: '1.2em' }}>kg</p>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <OrderTextField
                        inputRef={orderDetailRef}
                        onKeyDown={handleOrderDetailEnter}
                        defaultValue={orderForm?.orderInformation}
                        sx={
                            {
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderTopWidth: '0.5px',
                                        borderRadius: '0px 0px 15px 15px',
                                    },
                                },
                            }
                        }
                        id="outlined-basic" multiline={false} placeholder="Thông tin"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <IconButton
                                        onClick={() => {
                                            console.log("Send Button Click")
                                        }}
                                        sx={{ padding: '0' }}
                                    >
                                        <ArrowUpwardIcon
                                            sx={{
                                                borderRadius: '50% 50%',
                                                backgroundColor: 'green',
                                                color: "white",
                                                fontSize: "1em",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }} />
                </FormControl>
            </Stack>
        </ClickAwayListener>
    )
}

export default CreateOrderForm2