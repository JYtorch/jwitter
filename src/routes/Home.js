import Jweet from "components/Jweet";
import JweetFactory from "components/JweetFactory";
import { dbService } from "fbase";
import { useState, useEffect } from "react";

const Home = ({ userObj }) => {
  const [jweets, setJweets] = useState([]);  
  useEffect(() => {
    //firestore에 있는 모든 데이터를 실시간으로 가져와서 뿌려주기
    // onSnapshot은 데이터베이스의 변화(READ, CREATE, DELETE, UPDATE...)를 실시간으로 감지
    dbService.collection("jweets").orderBy("createdAt","desc").onSnapshot(snapshot => {
      const jweetArray = snapshot.docs.map(doc => ({        
        id: doc.id,
        ...doc.data(),
      }));
      setJweets(jweetArray);
    });
    // getJweets();
  }
  , []);

  // // firestore에 있는 모든 데이터를 가져와서 담아두기(forEach로 담아두기, 실시간X)
  // const getJweets = async () => {
  //   const dbJweets = await dbService.collection("jweets").get();
  //   dbJweets.forEach(document => {
  //     const jweetObject = {
  //       ...document.data(),
  //       id: document.id
  //     };
  //     // set~ 함수의 인자로 특정 함수를 사용할 수 있음. 이 경우 이전 값(prev) 사용 가능
  //     setJweets(prev => [jweetObject, ...prev]);
  //   });
  // };  
  
  return (
    <div className="container">
      <JweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {jweets.map(jweet =>          
          <Jweet 
            key={jweet.id} 
            jweetObj={jweet} 
            isOwner={jweet.creatorId === userObj.uid} 
          />
        )}
      </div>
    </div>  
  );
};
export default Home;