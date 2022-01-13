import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Jweet = ({ jweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newJweet, setNewJweet] = useState(jweetObj.text);

  // Delete 기능 
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this jweet?")
    if (ok) {
      await dbService.doc(`jweets/${jweetObj.id}`).delete();  // firestore는 폴더 구조이므로, collection과 id를 알면 해당 데이터 접근 가능
      if (jweetObj.attachmentUrl) {
        await storageService.refFromURL(jweetObj.attachmentUrl).delete(); // storage에 있는 이미지 삭제
      }
    }
  };

  // Update Form 버튼 (edit 모드 활성화 <=> 비활성화)
  const toggleEditing = () => {setEditing(prev => !prev)};

  // 수정 기능
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`jweets/${jweetObj.id}`).update({
      text: newJweet,
    });
    setEditing(false);
  }

  // input 태그의 value와 onChange 이벤트를 이용하여 state 조작
  const onChange = (event) => {
    const {target: {value}} = event;
    setNewJweet(value);
  };
  
  return (  
    <div className="jweet">
      {editing ?
        <>
          {isOwner &&
            <>
              <form onSubmit={onSubmit} className="container jweetEdit">
                <input 
                  type={"text"}
                  placeholder="Edit your jweet"
                  value={newJweet}
                  required
                  autoFocus
                  onChange={onChange}
                  className="formInput"
                  />
                <input type={"submit"} value={"Update Jweet"} className="formBtn"/>          
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          }
        </>                
        :
        <>
          <h4>{jweetObj.text}</h4>
          {jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} alt=""/>}
          {isOwner && (
            <div className="jweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      }
    </div>
  )
};
export default Jweet;