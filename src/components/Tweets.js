import React, { useEffect, useState } from 'react';
import {db, storage} from 'fbase';
import { collection, addDoc , query ,orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";

function Tweets({userObj}) {
    const [tweets, setTweets] = useState([]);
    useEffect( () => { //실시간 데이터베이스 문서들 가져오기
        //getTweets();
        const q = query(collection(db, "tweets"),
                  orderBy("createAt","desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newArray = [];
          querySnapshot.forEach((doc) => {
            newArray.push({...doc.data(), id:doc.id });
          });
          //console.log(newArray);
          setTweets(newArray);
        });
      } ,[tweets]);
  return (
    <div>
      {tweets.map(tweet => (
        <Tweet 
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
      
        />
      ))}
    </div>
  )
}

export default Tweets