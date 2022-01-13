import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  // input 태그에 값을 입력하기 위해서는 항상 value와 onchange 이벤트를 묶어서 사용해야 함.
  const onChange = (event) => {
    const {target: {name, value}} = event
    // 하나의 onChange 이벤트로 이메일과 패스워드 상태 변경
    if (name === 'email') {   
      setEmail(value)
    } else if (name ==='password') {
      setPassword(value)
    }
  }

  // 회원가입 & 로그인 기능
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // 이메일, 패스워드로 계정 생성
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else { 
        // 이메일, 패스워드로 로그인하기
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data)
    } catch (error) {
      console.log(error)
      setError(error.message);
    }
  }
  // 로그인 버튼 <-> 회원가입 버튼 전환 기능
  const toggleAccount = () => setNewAccount(prev => !prev);
  
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input 
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
          />
        <input 
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
          />
        <input type="submit" className="authInput authSubmit" value={newAccount ? "Create Account": "Sign In"} />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In": "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;