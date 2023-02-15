import ButtonPrimary from "../button/ButtonPrimary";
import ButtonDanger from "../button/ButtonDanger";
import styles from "./Modal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal } from "../../../store/modal";
import { useValidPassword } from "./../../../hooks/useInput";
import { joinRoom } from "../../../apis/room";
import { useNavigate } from "react-router-dom";

const JoinRoomModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = useSelector((state) => {
    return state.modal.title;
  });
  const roomId = useSelector((state) => {
    return state.modal.roomId;
  });
  const nickname = useSelector((state) => {
    return state.user.nickname;
  });
  const { value, isValid, disabled, handlePasswordChange } = useValidPassword("");

  const handleCloseModal = () => {
    dispatch(closeModal({ type: "JoinRoomModal" }));
  };

  const handleJoinRoom = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("roomId", roomId);
    form.append("password", value);
    form.append("nickname", nickname);
    const res = await joinRoom(form);

    if (res.data.message === "비밀번호가 틀립니다.") {
      dispatch(closeModal({ type: "JoinRoomModal" }));
      dispatch(
        openModal({ type: "ErrorModal", title: "비밀번호 오류", errMessage: res.data.message })
      );
    } else {
      dispatch(closeModal({ type: "JoinRoomModal" }));
      navigate(`/game/${res.data.roomId}`);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.card}>
        <h2>{title}</h2>
        <form className={styles.form} method="POST" onSubmit={handleJoinRoom}>
          <label htmlFor="pwd">비밀번호</label>
          <input
            className={styles.input}
            id="pwd"
            type="password"
            value={value}
            onChange={handlePasswordChange}
            autoComplete="off"
          />
          {!isValid && (
            <p className={styles.input_errMsg}>방 비밀번호는 4글자 이상 8글자 이하입니다.</p>
          )}
          <div className={styles.button_area}>
            <ButtonPrimary type="submit" disabled={disabled}>
              입장
            </ButtonPrimary>
            <ButtonDanger type="reset" onClick={handleCloseModal}>
              취소
            </ButtonDanger>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomModal;
