import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoom } from "../../store/room";
import { clearChat } from "../../store/chat";
import { CircularProgress } from "@mui/material";
import { openModal } from "../../store/modal";
import ButtonPrimary from "../common/button/ButtonPrimary";
import RoomCard from "./RoomCard";
import LoopIcon from "@mui/icons-material/Loop";
import styles from "./Lobby.module.css";
import ErrorModal from "../common/modal/ErrorModal";
import { lime } from "@mui/material/colors";
import { clearGameState } from "../../store/roomAndActive";
import { clearRoom } from "../../store/roomAndStandBy";

const Lobby = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => {
    return state.room.status;
  }); // 현재 상태 정보
  const rooms = useSelector((state) => {
    return state.room.rooms;
  }); // 방 목록

  // 새로고침 버튼 클릭
  const handleRefreshRoomList = () => {
    dispatch(getRoom());
  };

  // 방 만들기 버튼 클릭
  const handleOpenModal = () => {
    dispatch(openModal({ type: "CreateRoomModal", title: "방만들기" }));
  };

  useEffect(() => {
    dispatch(getRoom());
    dispatch(clearChat([{ sender: "", message: "" }]));
    dispatch(
      clearGameState({
        status: "",
        roomId: "",
        connectedUsers: "[{}]",
        round: "",
        voteRound: "",
        prevRound: "[{}]",
        agreeDisagree: "[{}]",
        guilty: "0",
        notGuilty: "0",
        script: "asd",
      })
    );
    dispatch(
      clearRoom([{ nickname: "", rotate: "", isHost: "", isReady: "" }])
    );
    return () => {};
  }, [dispatch]);

  return (
    <>
      <div className={styles.createButton}>
        <LoopIcon
          className={styles.guickStart}
          onClick={handleRefreshRoomList}
        />
        <ButtonPrimary value="quick">빠른입장</ButtonPrimary>
        <ButtonPrimary value="create" onClick={handleOpenModal}>
          방만들기
        </ButtonPrimary>
      </div>

      {status === "Loading" && (
        <div className={styles.loading}>
          <CircularProgress sx={{ color: lime[500] }} />
        </div>
      )}
      {status === "complete" && (
        <div className={styles.container}>
          {rooms.map((room) => (
            <RoomCard room={room} key={room.roomId} />
          ))}
        </div>
      )}

      {status === "fail" && <ErrorModal onClick={() => dispatch(getRoom())} />}
    </>
  );
};

export default Lobby;
