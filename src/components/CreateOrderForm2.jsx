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

            let error = "";

            if (quantity === "" || detail === "") {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            if (isNaN(quantity) || quantity <= 0) {
                error = "* Khối lượng phải lớn hơn 0!";
            }

            if (detail.length < 5) {
                error += "\n";
                error += "* Thông tin tối thiểu 5 ký tự!";
            }

            if (error !== "") {
                alert(error);
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
                                <InputAdornment position="end">
                                    kg
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
                        id="outlined-basic" multiline={false} placeholder="Thông tin" />
                </FormControl>
            </Stack>
        </ClickAwayListener>
    )
}

export default CreateOrderForm2