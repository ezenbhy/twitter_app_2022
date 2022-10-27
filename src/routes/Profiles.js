import React, { useEffect ,useState} from 'react';
import {authService, db ,storage} from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc , query , where, orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import {  updateProfile } from "firebase/auth";
import { async } from '@firebase/util';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

function Profiles({userObj}) {
  console.log(userObj.photoURL);
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/'); //홈으로 이동 즉 리다이렉트 기능이다.
  }

  const getMyTweets = async () => {
    const q = query(collection(db, "tweets"),
                    where("createId", "==" , userObj.uid), 
                    orderBy("createAt","desc"))
    const querySnapshot = await getDocs(q);
    const newArray =  [];
    querySnapshot.forEach((doc) => {
      newArray.push({...doc.data(), id:doc.id });
    });
    setTweets(newArray);
  }

  useEffect(() => {
    getMyTweets();
  },[]);

  const onChange = e => {
    const {target: {value}} =e;
    setNewDisplayName(value);
    
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    
    let attachmentUrl ="";
    if(attachment !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(storageRef, attachment, 'data_url');
      //console.log(response);
      attachmentUrl =  await getDownloadURL(ref(storage, response.ref));
      console.log(attachmentUrl);
      
    }

    if(userObj.displayName != newDisplayName || userObj.photoURL != null){
      await updateProfile(userObj, 
        {displayName: newDisplayName, photoURL: attachmentUrl});
    }
    setAttachment("");

  }
  const onFileChange = e => {
    //console.log(e.target.files);
    const {target: {files}} = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      //console.log(finishedEvent);
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onClearAttachment = () => setAttachment("");

  return (
    <>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder='Display name'
        onChange={onChange} value={newDisplayName} />
        <input type="file" accept='image/*' onChange={onFileChange} />

      <input type="submit" value="Update Profile" />
      {attachment && 
        <div>
          <img src={attachment} width="50" height='50' />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      }
    </form>
    <button onClick={onLogOutClick}>Log Out</button>
    <div>
      {tweets.map(tweet => (
        <Tweet 
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
        />
      ))}
    </div>
    </>
  )
}

export default Profiles