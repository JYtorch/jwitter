import React, { useState } from 'react';
import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  // 로그아웃
  const onLogOutClick = () => {
    const ok = window.confirm("Do you want to log out?")
    if (ok) {
      authService.signOut()
      history.push("/");      // 로그아웃 이후 "/" 로 이동
    }
  };

  // 로그인한 사용자의 Jtweets 가져오기
  // const getMyJweets = async () => {
  //   const jweets = await dbService
  //     .collection("jweets")
  //     .where("creatorId", "==", userObj.uid)
  //     .orderBy("createdAt", "desc")
  //     .get();
  //     console.log(jweets.docs.map(doc => doc.data()));
  //   };

  // useEffect(() => {
  //   getMyJweets();
  // }, []);

  const onChange = (event) => {
    const {target: {value}} = event;
    setNewDisplayName(value);
  };

  // 프로필 닉네임 수정
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {      
      await userObj.updateProfile({displayName: newDisplayName,});      
    }
    // refreshUser: 최상위 컴포넌트 (App.js)에 있는 userObj 갱신하기 위한 props 함수 (닉네임 수정 실시간 반영)
    refreshUser();
  };
  return (
  <div className="container">
    <form onSubmit={onSubmit} className="profileForm">
      <input 
        onChange={onChange}
        type={"text"}
        autoFocus
        placeholder="Display Name"
        value={newDisplayName}
        className="formInput"
      />
      <input 
        type={"submit"}
        value={"Update Profile"}
        className="formBtn"
        style={{marginTop: 10,}}
      />
    </form>
    <span 
      className="formBtn cancelBtn logOut" 
      onClick={onLogOutClick}>
      Log Out
    </span>
  </div>
  )};
export default Profile