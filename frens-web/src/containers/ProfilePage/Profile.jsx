import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoginUser, updateQuestions, updateSocial } from "../../actions";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../../themes";
import axios from "axios";

// import Header from "../../components/Header";
import DesktopNav from "../../components/DesktopNav";
import MobileNav from "../../components/MobileNav";
import CardList from "./CardList";
import SocialMedia from "./SocialMedia";

const Container = styled.div`
  margin: 1rem 2rem;
`;

const api = axios.create({
  baseURL: `http://localhost:5000`,
});

function Profile() {
  let theme = "light";
  // Check redux isDark state
  const loginUser = useSelector((state) => state.loginUser);
  const social = useSelector((state) => state.socialProfile);
  const questions = useSelector((state) => state.questionsProfile);

  const isDark = useSelector((state) => state.isDark);
  const dispatch = useDispatch();

  const [cardlist, setCardlist] = useState([]);
  if (isDark) {
    theme = "dark";
  } else {
    theme = "light";
  }

  useEffect(() => {
    axios.get("/questions").then((response) => {
      setCardlist(response.data);
    });

    const token = JSON.parse(localStorage.getItem("profile")).token;

    axios.get("/loginUser/" + token).then((response) => {
      console.log(
        "%c [ jsonfy ]",
        "font-size:13px; background:pink; color:#bf2c9f;",
        response.data
      );
      dispatch(setLoginUser(response.data));
      dispatch(updateSocial(response.data.social));
      dispatch(updateQuestions(response.data.questions));

      //reducer not getting server datat after refresh
    });
  }, []);

  // function getLoginUserInfo() {
  //   const getUserInfo = async () => {
  //     const token = JSON.parse(localStorage.getItem("profile")).token;

  //     const userInfo = {
  //       headers: {
  //         "content-type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     };
  //     const response = await axios.get("/posts", userInfo);

  //   if (response?.data) {
  //     dispatch(setLoginUser(response.data));
  //     if (response.data.questions)
  //       dispatch(updateQuestions(response.data.questions));
  //     if (response.data.social) dispatch(updateSocial(response.data.social));
  //   }
  // };
  //   getUserInfo();
  // }

  function handleProfile() {
    // console.log("[ social ]", social);
    console.log("[ questions ]", questions);
    console.log("[ login user ]", loginUser);
    console.log("[ isDark ]", isDark);
  }

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Container>
        <DesktopNav />
        <MobileNav />
        <button onClick={() => handleProfile()}> Profile !!! </button>

        <SocialMedia loginUser={loginUser} />
        <CardList cardlist={cardlist} />
      </Container>
    </ThemeProvider>
  );
}

export default Profile;
