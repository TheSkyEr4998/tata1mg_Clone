import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lightOrange } from "../../Colors/Color";
import { emptycart } from "../../Redux/action";
import payment from "./Payment/payment";

export default function CheckoutButton() {
  let cartItems = useSelector((store) => store.cartItems);
  const discount = useSelector((store) => store.couponDiscount);
  const dispatch = useDispatch();
  let location = "Delhi";
  const payment = (cartItems) => {
    fetch(
      "https://express-stripe-server.herokuapp.com/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [...cartItems],
          urls: {
            success: `http://localhost:3000/`,
            cancle: `http://localhost:3000/`,
          },
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        setInterval(() => {
          dispatch(emptycart());
        }, 6000);
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "10px",
        marginTop: "5px",
        boxShadow:
          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box>Your delivery location</Box>
        <Box>
          <Box>{location}</Box>
        </Box>
      </Box>
      <Box>
        <Button
          color="white"
          bg={lightOrange}
          width="99%"
          _hover={{ bg: "teal.600" }}
          onClick={() => {
            let cItem = cartItems.map((item, index) => {
              if (discount > 0) {
                item.price = item.price - (item.price * (discount + 10)) / 100;
              } else {
                item.price = item.price - (item.price * 10) / 100;
              }

              return item;
            });

            payment(cItem);
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}
