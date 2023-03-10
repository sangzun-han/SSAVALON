import styles from "./MypageInfo.module.css";
import MainJob from "./MainJob";
import Subjob from "./SubJob";
import RecentGame from "./RecentGame";
import { useState, useEffect } from "react";
import { getMypage } from "../../apis/user";
import { useSelector } from "react-redux";

const MypageInfo = () => {
  const [mainJob, setMainJob] = useState({}); // 가장 승률이 높은 직업
  const [subJobs, setSubJobs] = useState([]); // 나머지 직업
  const [gameResultList, setGameResultList] = useState([]); // 최근 게임 결과
  const [oddsList, setOddsList] = useState([]); // 직업별 승률 정보
  const handleJobChange = (subJob) => {
    setMainJob(subJob);
    const subJ = oddsList.filter((job) => job !== subJob);
    setSubJobs(subJ);
  };

  // 전역변수로 등록된 닉네임 가져오기
  const nickName = useSelector((state) => state.user.nickname);
  // 닉네임을 가지고 내 정보 요청
  useEffect(() => {
    if (nickName !== "") {
      const res = getMypage(nickName);
      res.then((result) => {
        // 이전 게임 기록 정보 처리 및 저장
        const recentGames = [];
        for (let i = 0; i < result.gameResultList.length; i += 6) {
          const myResult = result.gameResultList
            .slice(i, i + 6)
            .find((e) => e.nickname === nickName);

          recentGames.push({
            gameRes: result.gameResultList.slice(i, i + 6),
            isWin: myResult.isWin,
          });
        }
        setGameResultList(recentGames);

        // 직업별 승룰 정보 저장
        setOddsList(result.oddsList);

        // 가장 승률이 좋은 직업 탐색 및 저장
        const mainJ = result.oddsList.reduce((prev, value) => {
          return prev.odds >= value.odds ? prev : value;
        });
        setMainJob(mainJ);

        // 나머지 직업 분류 및 저장
        const subJ = result.oddsList.filter((job) => job !== mainJ);
        setSubJobs(subJ);
      });
    }
  }, [nickName]);

  return (
    <>
      <div className={styles.container}>
        <MainJob mainJob={mainJob} />
        <div className={styles.sub_player}>
          {subJobs.map((subJob, index) => (
            <Subjob
              subJob={subJob}
              key={index}
              handleJobChange={() => handleJobChange(subJob)} // 메인 직업 교체
            />
          ))}
        </div>
      </div>
      <div className={styles.recent_games}>
        {gameResultList.map((gameResult, index) => (
          <RecentGame gameResult={gameResult} key={index} />
        ))}
      </div>
    </>
  );
};

export default MypageInfo;
