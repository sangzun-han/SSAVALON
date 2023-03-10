import styles from "./GameBoard.module.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket, chat, disconnect } from "../../../hooks/useSocket";
import { useParams } from "react-router-dom";
import { useValidMessage } from "../../../hooks/useInput";
import GameBoardImage from "../../../assets/images/image-game-board.png";
import Chat from "../chatting/Chat";
import UnderCard from "../underCard/UnderCard";
import AvatarImage from "../avatar/AvatarImage";
import SelectCard from "../selectCard/SelectCard";
import ButtonRS from "../../common/button/ButtonRS";
import Explanation from "../explanation/Explanation";
import RoundTokenBack from "../logCard/RoundTokenBack";
import { selectorRoomAndActive } from "./../../../store/roomAndActive";
import { selectorRoomAndStandBy } from "./../../../store/roomAndStandBy";
import { exit, ready, start, vote } from "../../../apis/readystart";
import { useNavigate } from "react-router-dom";
import RollCard from "../rollCard/RollCard";
import RoundResult from "../result/RoundResult";
import TrialResult from "./../result/TrialResult";
import GameResult from "./../result/gameResult/GameResult";
const GameBoard = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState({
    under: false, // 찬반 or 유무죄 투표
    select: false, // 배심원단 선정 or 경찰 선택
    role: false, // 역할 분배
    agree: false, // 찬반 투표 결과
    guilty: false, // 유무죄 결과
    result: false, // 게임 결과
  });
  const [swipe, setSwipe] = useState({ chat: false, rule: false }); // 채팅창, 룰 설명창
  const [player, setPlayer] = useState([]); // 준비상태 내 정보
  const [myInfo, setMyInfo] = useState({}); // 게임중 내 정보
  const [job, setJob] = useState(""); // 게임중 내 직업 정보
  const [flag, setFlag] = useState(true);
  const { id } = useParams(); // 방 아이디
  const { value, handleInputChange, handleInputReset } = useValidMessage(""); // 채팅 정보
  const client = useRef({});
  const gameClient = useRef({});
  const nickname = useSelector((state) => state.user.nickname); // 내 닉네임
  const { connectedUsers } = useSelector(selectorRoomAndStandBy); // 대기중인 유저 정보
  const gameStatus = useSelector(selectorRoomAndActive); // 게임중 정보
  useSocket(client, gameClient, id, nickname);
  // 채팅 보내기
  const sendMessage = () => {
    chat(client, id, nickname, value);
  };
  // 채팅창, 룰 설명창 열고 닫기
  const handleSwipe = (type) => {
    if ((type === "chat" && swipe.chat) || (type === "rule" && swipe.rule))
      setSwipe({ chat: false, rule: false });
    else if (type === "chat") setSwipe({ chat: true, rule: false });
    else if (type === "rule") setSwipe({ chat: false, rule: true });
  };

  // 분배 받은 역할, 배심원단 선정, 경찰 선택, 찬반 투표, 유무죄 투표 띄우기
  const open = (type) => {
    if (type === "under") {
      // 찬반 or 유무죄 투표창 열기
      setModalOpen({
        under: true,
        select: false,
        role: false,
        agree: false,
        guilty: false,
        result: false,
      });
    } else if (type === "role") {
      // 게임 시작될 때 분배된 역할 보여주고 배심원장에게 배심원 선정창 표시
      setModalOpen({
        under: false,
        select: false,
        role: true,
        agree: false,
        guilty: false,
        result: false,
      });
      setTimeout(() => {
        setModalOpen({
          under: false,
          select: true,
          role: false,
          agree: false,
          guilty: false,
          result: false,
        });
      }, 5000);
    } else if (type === "select") {
      // 배심장에게 배심원 선정창 표시
      setModalOpen({
        under: false,
        select: true,
        role: false,
        agree: false,
        guilty: false,
        result: false,
      });
    } else if (type === "agree") {
      // 찬반 투표 결과 표시
      setModalOpen({
        under: false,
        select: false,
        role: false,
        agree: true,
        guilty: false,
        result: false,
      });
    } else if (type === "guilty") {
      // 유무죄 투표 결과 표시
      setModalOpen({
        under: false,
        select: false,
        role: false,
        agree: false,
        guilty: true,
        result: false,
      });
    } else if (type === "result") {
      // 게임 결과 표시
      setModalOpen({
        under: false,
        select: false,
        role: false,
        agree: false,
        guilty: false,
        result: true,
      });
    }
  };

  // 대기중 내 정보 저장
  useEffect(() => {
    if (connectedUsers.players !== undefined) {
      setPlayer(
        connectedUsers.players.find((player) => player.nickname === nickname)
      );
    }
    return () => {};
  }, [nickname, connectedUsers]);

  // 게임중 내정보 저장, 게임 상태별 분기 처리
  useEffect(() => {
    if (gameStatus.playerList !== undefined) {
      setMyInfo(
        gameStatus.playerList.find((player) => player.nickname === nickname)
      );
      setJob(
        gameStatus.playerList.find((player) => player.nickname === nickname).job
      );
    }

    if (
      gameStatus.status === "makeJury" &&
      gameStatus.round === 1 &&
      gameStatus.voteRound === 1
    ) {
      open("role");
    } else if (
      gameStatus.status === "voteAgreeDisagree" ||
      gameStatus.status === "voteGuiltyNotGuilty"
    ) {
      if (flag) {
        open("under");
      }
    } else if (
      gameStatus.status === "makeJury" ||
      gameStatus.status === "winCitizen"
    ) {
      open("select");
      setFlag(true);
    } else if (gameStatus.status === "resultAgreeDisagree") {
      open("agree");
      setFlag(true);
    } else if (gameStatus.status === "resultGuiltyNotGuilty") {
      open("guilty");
    } else if (
      gameStatus.status === "resultGame" ||
      gameStatus.status === "successChoice"
    ) {
      open("result");
    }
  }, [
    gameStatus.status,
    nickname,
    flag,
    gameStatus.playerList,
    gameStatus.round,
    gameStatus.voteRound,
  ]);

  return (
    <>
      <div
        className={styles.game_table}
        style={{ backgroundImage: `url(${GameBoardImage})` }}
      >
        <div className={styles.game_table_settings}>
          {connectedUsers.players !== undefined &&
            connectedUsers.players.map((user) => (
              <AvatarImage
                user={user}
                key={user.nickname}
                job={job}
                activePlayer={
                  gameStatus.playerList !== undefined &&
                  gameStatus.playerList.find(
                    (player) => player.nickname === user.nickname
                  )
                }
              />
            ))}
        </div>

        <div className={styles.game_settings}>
          {gameStatus.status !== "" && <RoundTokenBack />} {/*재판 라운드*/}
          {gameStatus.status !== "" && <RoundTokenBack voteRound={true} />}{" "}
          {/*투표 라운드*/}
          <div className={styles.game_table_buttons}>
            {/*참가자 준비 버튼*/}
            {gameStatus.status === "" && !player.isHost && (
              <ButtonRS content="준비" onClick={() => ready(id, nickname)} />
            )}

            {/*호스트 시작 버튼*/}
            {gameStatus.status === "" && player.isHost && (
              <ButtonRS
                content="시작"
                onClick={() => start(id, connectedUsers.players)}
              />
            )}

            {/*나가기 버튼*/}
            {gameStatus.status === "" && (
              <ButtonRS
                content="나가기"
                onClick={() => {
                  exit(id, nickname);
                  navigate("/lobby");
                  disconnect(client);
                  disconnect(gameClient);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/*찬반, 유무죄 투표*/}
      <UnderCard
        open={modalOpen.under}
        setModalOpen={setModalOpen}
        vote={vote}
        myInfo={myInfo}
        roomId={id}
        setFlag={setFlag}
      />

      {/*분배된 역할 보여주기*/}
      {modalOpen.role && <RollCard job={job} />}

      {/*배심원단 선정, 경찰 선택*/}
      {modalOpen.select && (
        <SelectCard open={modalOpen.select} myInfo={myInfo} />
      )}

      {/*찬반 투표 결과*/}
      {modalOpen.agree && <RoundResult />}

      {/*유무죄 투표 결과*/}
      {modalOpen.guilty && <TrialResult />}

      {/*최종 게임 결과*/}
      {modalOpen.result && (
        <GameResult
          client={client}
          gameClient={gameClient}
          disconnect={disconnect}
        />
      )}

      {/*채팅창*/}
      <Chat
        sendMessage={sendMessage}
        value={value}
        handleInputChange={handleInputChange}
        handleInputReset={handleInputReset}
        swipe={swipe.chat}
        handleSwipe={() => handleSwipe("chat")}
      />

      {/*룰 설명창*/}
      <Explanation swipe={swipe.rule} handleSwipe={() => handleSwipe("rule")} />
    </>
  );
};

export default GameBoard;
