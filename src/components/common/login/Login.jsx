import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./LoginButton.module.css";
import { setUserInfo } from "../../../store/userInfo";
import { login } from "../../../apis/user";
import { lime } from '@mui/material/colors';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    // api 호출해서  "status":"empty" 인지 확인
    login(code).then((res) => {
      if (res.data.status === "empty")
        navigate("/signup", {
          state: res.data.kakaoId,
        });
      // empty이면 회원가입 페이지
      else if (res.data.status === "valid") {
        const data = {
          isLogin: true,
          nickname: res.data.nickname,
          refreshToken: res.data.refreshToken,
        };
        dispatch(setUserInfo(data)); // valid이면 로그인 처리
        navigate("/");
      }
    });
  }, [code, dispatch, navigate]);

  return (
    <>
      <div className={styles.loading}>
        <CircularProgress sx={{ color: lime[500] }} />
      </div>
    </>
  );
};

export default Login;
