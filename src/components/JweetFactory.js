import { dbService, storageService } from "fbase";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const JweetFactory = ({ userObj }) => {
  const [jweet, setJweet] = useState("");
  const [attachment, setAttachment] = useState("");
  // firestore에 데이터 저장하기
  const onSubmit = async (event) => {
    if (jweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`); // firebase storage에 유저 아이디로 이미지 폴더 생성
      const response = await attachmentRef.putString(attachment, "data_url");         // 폴더에 이미지 넣고 UploadTaskSnapshot 리턴 받음
      attachmentUrl = await response.ref.getDownloadURL();        // 해당 이미지 주소에 접근
    }
    const jweetObj = {
      text: jweet, //jweet: jweet
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("jweets").add(jweetObj);
    setJweet("");
    setAttachment("");
  }

  const onChange = (event) => {
    const {target: {value}} = event;
    setJweet(value);
  }

  // 이미지 파일 저장하기
  const onFileChange = (event) => {
    const {target: {files}} = event;
    const theFile = files[0];        // input 태그의 file은 한개
    const reader = new FileReader(); // FileReader 객체는 파일(이미지 등)의 내용을 읽어서 문자열로 저장해줌.
    reader.onloadend = (finishedEvent) => {  // 읽기 동작이 끝났을 때 onloadend 이벤트 발생
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  }
  const fileInput = useRef(); // 이미지를 넣는 input 태그 접근

  // 첨부한 그림 파일 지우기
  const onClearAttachment = () => {    
    setAttachment("");
    // fileInput.current.value = "";
  }
  return (
    <form onSubmit={onSubmit} className="factoryForm">        
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={jweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
      <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{backgroundImage: attachment }}
            alt=""
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}

export default JweetFactory;