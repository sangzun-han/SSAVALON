import styles from "./Avatar.module.css";
import AvatarFrame from "../../../assets/images/image-avatar-frame.png";
import CitizenImage from "../../../assets/images/image-citizen-circle.png";

const AvatarImage = (props) => {
  const { people } = props;

  return (
    <div
      className={styles.game_setting}
      style={{ transform: `rotate(${people.rotate})` }}
    >
      <div
        className={styles.game_setting_inner}
        style={{
          transform: `translate(-50%,-50%) rotate(-${people.rotate})`,
        }}
      >
        <div className={styles.player}>
          <div className={styles.player_avatar}>
            <div
              className={styles.player_avatar_background}
              style={{ backgroundImage: `url(${AvatarFrame})` }}
            ></div>
            <div className={styles.player_avatar_container}>
              <div
                className={styles.player_avatar_avatar}
                style={{ backgroundImage: `url(${CitizenImage})` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarImage;