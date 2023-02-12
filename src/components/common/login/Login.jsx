import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../../store/login";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./LoginButton.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  const loginState = useSelector((state) => {
    return state.login;
  });

  useEffect(() => {
    dispatch(getUserInfo(code));
    if (loginState.userStatus === "empty") {
      navigate("/");
    }
  }, [navigate, code, dispatch, loginState.userStatus]);

  return (
    <>
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    </>
  );
};

export default Login;
