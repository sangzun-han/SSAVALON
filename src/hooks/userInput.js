import { useState, useEffect } from "react";

export const useValidPassword = (password) => {
  const [value, setValue] = useState(password);
  const [isValid, setIsValid] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const handlePasswordChange = (event) => {
    setValue(event.target.value);
  };

  const handleValidPassword = () => {
    if (value.length <= 8 && value.length >= 4) setIsValid(true);
    else setIsValid(false);
  };

  useEffect(() => {
    if (isValid) setDisabled(false);
    else setDisabled(true);
  }, [isValid]);

  return {
    value,
    isValid,
    disabled,
    handlePasswordChange,
    handleValidPassword,
  };
};

export const useValidTitleAndPassword = (roomInfo, roomValid) => {
  const [value, setValue] = useState(roomInfo);
  const [isValid, setIsValid] = useState(roomValid);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleInputChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
  };

  const handleCheckedChange = () => {
    setChecked(!checked);
  };

  const handleIsTitleValid = () => {
    if (value.title.trim().length >= 4 && value.title.trim().length <= 8)
      setIsValid({ ...isValid, title: true });
    else setIsValid({ ...isValid, title: false });
  };

  const handleIsPasswordValid = () => {
    if (value.password.trim().length >= 4 && value.password.trim().length <= 8)
      setIsValid({ ...isValid, password: true });
    else setIsValid({ ...isValid, password: false });
  };

  useEffect(() => {
    if (isValid.title && isValid.password) setDisabled(false);
    else if (isValid.title && !checked) setDisabled(false);
    else setDisabled(true);

    return () => {};
  }, [isValid, checked]);

  useEffect(() => {
    if (!checked) setValue((value) => ({ ...value, password: "" }));
  }, [checked]);

  return {
    value,
    isValid,
    checked,
    disabled,
    handleInputChange,
    handleCheckedChange,
    handleIsTitleValid,
    handleIsPasswordValid,
  };
};
