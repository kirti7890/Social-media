import { Route, Routes } from "react-router-dom";
import "./App.css";
import Mockman from "mockman-js";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import UserList from "./components/UserList/UserList";
import SearchBar from "./components/SearchBar/SearchBar";
import Footer from "./components/Footer/Footer";
import SignUp from "./pages/Signup/SignUp";
import Landing from "./pages/LandingPage/Landing";
import Explore from "./pages/Explore/Explore";
import Bookmark from "./pages/Bookmark/Bookmark";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import LikePage from "./pages/LikePage/LikePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useContext } from "react";
import { DataContext } from "./contexts/DataContext";
import Modal from "./components/Modal/Modal";
import axios from "axios";
import { AsideDataContext } from "./contexts/AsideDataContext";
import ProfileModal from "./components/Modal/ProfileModal";
import AuthWrapper from "./components/Authenticate/AuthWrapper";
import { Discuss } from "react-loader-spinner";
import SinglePost from "./pages/SinglePost.jsx/SinglePost";
import UserModal from "./components/Modal/UserModal";
import CommentModal from "./components/Modal/CommentModal";
import SearchPage from "./pages/SearchPage/SearchPage";

function App() {
  const {
    setEncodedToken,
    setLoading,
    state,
    dispatch,
    openModal,
    setOpenModal,
    loading,
    encodedToken,
    searchDisplay,
  } = useContext(DataContext);

  const {
    editPost,
    setEditPost,
    editProfile,
    setEditProfile,
    userModal,
    setUserModal,
    addComment,
    setAddComment,
  } = useContext(AsideDataContext);

  useEffect(() => {
    const encodedToken = localStorage.getItem("token");
    setEncodedToken(encodedToken ?? "");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/users");
        dispatch({ type: "GET_USERS", payload: response.data.users });
      } catch (e) {
        console.log(e);
      }
    })();
  }, [encodedToken]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts");
        // console.log(response);
        dispatch({ type: "GET_POSTS", payload: response.data.posts });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [encodedToken]);

  window.onbeforeunload = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="App">
      {loading && (
        <div className="loader">
          <Discuss
            height="200"
            width="200"
            ariaLabel="tail-spin-loading"
            radius="1"
            color="#FF7E95"
          />
        </div>
      )}
      {editPost && <Modal open={setEditPost} />}
      {openModal && <Modal open={setOpenModal} />}
      {editProfile && <ProfileModal open={setEditProfile} />}
      {userModal.show && <UserModal open={setUserModal} />}
      {addComment.show && <CommentModal open={setAddComment} />}
      {/* {followingModal && <UserModal open={setFollowingModal} />} */}
      <div className="main">
        {encodedToken && <Navbar />}
        <div className="section">
          <Routes>
            <Route path="/mockman" element={<Mockman />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route
              path="/landing"
              element={
                <AuthWrapper>
                  <Landing />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/explore"
              element={
                <AuthWrapper>
                  <Explore />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/bookmark"
              element={
                <AuthWrapper>
                  <Bookmark />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/likepage"
              element={
                <AuthWrapper>
                  <LikePage />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/profilepage/:username"
              element={
                <AuthWrapper>
                  <ProfilePage />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/postpage/:postId"
              element={
                <AuthWrapper>
                  <SinglePost />
                </AuthWrapper>
              }
            ></Route>
            <Route
              path="/search"
              element={
                <AuthWrapper>
                  <SearchPage />
                </AuthWrapper>
              }
            ></Route>
          </Routes>
        </div>
        {encodedToken && (
          <div>
            <div className="side-search-bar">
              <SearchBar />
              <div className="user-container">
                <h2>You might Like</h2>
                {/* Displaying suggestions to whom user can follow*/}
                {state?.userToFollow?.map((user) => (
                  <div key={user._id}>
                    {" "}
                    <UserList user={user} />{" "}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
