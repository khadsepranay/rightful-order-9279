import { ChakraProvider } from "@chakra-ui/react";
import { Slider } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeNavbar from "../../Home/HomeNavbar";
import Loader from "../Loader";
import { useSelector, useDispatch } from "react-redux";
import { isadded, newProductAdded } from "../../../Redux/cart/actions";
import { isAddedToCart } from "../../../Redux/cart/actionTypes";
import { useToast } from "@chakra-ui/react";
import { LoadingButton } from "@mui/lab";

function SingleProduct() {
  let location = useLocation();
  let Navigate = useNavigate()
  let path = location.pathname;
  let [nothing, category, sub_category, id] = path.split("/");
  let [data, setData] = useState({});
  let [value, setValue] = useState(100);
  let [loading, setLoading] = useState(false);
  let [buttonLoading, setButtonLoading] = useState(true);

  let dispatch = useDispatch();
  let toast = useToast();

  let Auth = useSelector((state) => state.Auth);
  let Cart = useSelector((state) => state.Cart);
  let isLogin = Auth.isLogin;
  let isAdded = Cart.isAdded;
  
  let token = JSON.parse(localStorage.getItem("token"));
  

  useEffect(() => {
    dispatch({ type: isAddedToCart, payload: false });
    setLoading(true);
    axios
      .get(
        `https://tender-lime-pike.cyclic.app/product/${category}/${sub_category}/${id}`
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
        setButtonLoading(false)
        scrollToTop();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
      dispatch(isadded(data._id));
  }, [data]);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function addToCart(id) {
    let price = null;
    let tenure = null;
    if (value == 0) {
      price = data.price3;
      tenure = 3;
    } else if (value == 50) {
      price = data.price2;
      tenure = 6;
    } else {
      price = data.price1;
      tenure = 12;
    }
    let token = JSON.parse(localStorage.getItem("token"));
    setButtonLoading(true);
    axios
      .get(`https://tender-lime-pike.cyclic.app/cart/add/${id}`, {
        headers: {
          price,
          token,
          tenure,
        },
      })
      .then((res) => {
        dispatch(newProductAdded(true));
        toast({
          title: "Product added to cart",
          description: `Product has been added to cart successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setButtonLoading(false);
        dispatch(isadded(data._id));
      })
      .catch((err) => {
        alert(err);
      });
  }

  useEffect(()=>{
    if(!token){
      alert('Please Login')
      Navigate('/')
    }
  },[])

  if (loading) {
    return (
      <ChakraProvider>
        <Loader />
      </ChakraProvider>
    );
  }

  return (
    <Box sx={{ marginTop: "90px" }}>
      <ChakraProvider>
        <HomeNavbar />
      </ChakraProvider>
      <Box
        sx={{
          display: { lg: "grid", md: "grid", sm: "flex", xs: "flex" },
          gridTemplateColumns: "3fr 2fr",
          width: "97vw",
          margin: "auto",
          justifyContent: "space-between",
          gap: "20px",
          flexDirection: { sm: "column", xs: "column" },
          padding: "20px",
        }}
      >
        <Box>
          <Box
            component="img"
            src={data.image}
            sx={{
              width: { lg: "70%", md: "80%", sm: "90%", xs: "100%" },
              height: { lg: "70%", md: "80%", sm: "90%", xs: "100%" },
              margin: "auto",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              textAlign: "left",
              border: "1px solid gray",
              padding: "10px",
              borderRadius: "10px",
              marginTop: "50px",
            }}
          >
            <Box
              component="img"
              src="https://www.rentomojo.com/public/images/icons/virusSafetyGreen.png"
              sx={{ width: "50px" }}
            ></Box>
            <Box>
              Safety precautions during COVID-19. We’re taking additional steps
              and precautionary measures to protect our community from COVID-19.
            </Box>
            <Box>Know More</Box>
          </Box>
        </Box>
        <Box sx={{ padding: "100px auto", width: "100%" }}>
          <Box sx={{ fontSize: "22px", fontWeight: "600", color: "#313131" }}>
            {data.title}
          </Box>
          <Box sx={{ margin: "25px 0px" }}>
            <Slider
              aria-label="Custom marks"
              defaultValue={100}
              value={value}
              onChange={(e) => handleChange(e)}
              step={50}
              sx={{ color: "#FF6464" }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ color: "#313131" }}>3+</Box>
              <Box sx={{ color: "#313131" }}>6+</Box>
              <Box sx={{ color: "#313131" }}>12+</Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                boxSizing: "border-box",
                padding: "15px",
                border: "1px solid #c0c0c0",
                margin: "15px auto",
                fontSize: "20px",
                color: "#404040",
              }}
            >
              ₹{" "}
              {value === 100
                ? data.price1
                : value == 50
                ? data.price2
                : data.price3}
              {data.desc}
              <Box
                sx={{ fontSize: "12px", textAlign: "center", color: "#808080" }}
              >
                Monthly Rent
              </Box>
            </Box>
            <Box
              sx={{
                boxSizing: "border-box",
                padding: "15px",
                border: "1px solid #c0c0c0",
                margin: "15px auto",
                fontSize: "20px",
                color: "#404040",
              }}
            >
              ₹ {data.price2}
              <Box
                sx={{ fontSize: "12px", textAlign: "center", color: "#808080" }}
              >
                Refundable Deposit
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              border: "1px solid #c0c0c0",
              padding: "5px",
              margin: "20px 0px",
            }}
          >
            <Box>7 days free trial</Box>
            <Box>Free Relocation</Box>
            <Box>Free Upgrade</Box>
          </Box>
          <Box sx={{ margin: "20px auto" }}>
            <LoadingButton
              loading={buttonLoading}
              sx={{
                backgroundColor: "red",
                color: "white",
                width: "100%",
                margin: "45px auto",
                ":hover": { backgroundColor: "#FF6464" },
              }}
              onClick={() => addToCart(data._id)}
              disabled={!isLogin || isAdded}
            >
              {isAdded ? "Added to cart" : "Add To Cart"}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SingleProduct;
