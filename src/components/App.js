import AppRouter from "components/AppRouter";
import { useEffect, useState } from "react"
import { authService } from "fbase";
import { cloneDeep } from "lodash";

function App() {
  // React Hook: 기존 Class 바탕의 코드를 작성할 필요 없이 상태 값 저장 및 변경 가능  
  // init: firebase가 페이지가 최초로 로드되는 시점에 로그인 상태 정보를 인지하지 못함
  // 따라서 onAuthStateChanged와 init을 통해 로그인 상태 여부를 감지할 수 있도록 함
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState("");  

  // useEffect: 컴포넌트가 mount 될 때 실행
  useEffect(() => {
    
    // onAuthStateChanged: user의 로그인 상태 변화 listen
    authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          user.updateProfile({displayName: "User"});   // 이메일 로그인인 경우 사용자 닉네임이 null 이기 때문에 임의로 User로 설정해주기
        }
        setUserObj(user);

        // setUserObj(
        //   // user의 정보 중 일부분(displayName, updateProfile 함수, uid)만 저장하는 방법
        //   {
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args) => {user.updateProfile(args)}
        //   }
        // );
      } else {
        setUserObj("");
      }
      setInit(true);
    })
    
  }, [])

  // refreshUser: User 정보를 최신으로 갱신해서 하위 컴포넌트로 뿌려주기(닉네임 업데이트 버튼을 누르면 작동함)


  // 이 코드에서 왜 setUserObj를 통한 state 변화가 일어나지 않는 것일까?
  // 노마드 코더 강의에서는 setUserObj(user)을 통한 조작은 너무 큰 배열이 들어와서 변화를 인식하지 못한다고 했다.
  // 하지만 배열을 간소화시켜도 리렌더링 되지 않는 이슈가 있다. 
  // 더 공부해야할 부분이다.
  // 검색을 통해 loadash의 cloneDeep 메소드를 통해 깊은 복사를 해줌으로써 일단 setUserObj가 발생되도록 해줬다. 
  // 하지만 이 방법 역시, 연속해서 두번, 세번 Update Profile 버튼 클릭시 리렌더링되지 않는 이슈가 있다.
  const refreshUser = () => {
    console.log('refresh!!')
    const user = authService.currentUser;
    setUserObj(
      cloneDeep(user)
      // {
      //   displayName: user.displayName,
      //   // ...prev
      //   uid: user.uid,
      //   updateProfile: (args) => {user.updateProfile(args)}
      // }    
      );    
    console.log(userObj)
  };

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Jwitter</footer>
    </>
  )
}

export default App;
