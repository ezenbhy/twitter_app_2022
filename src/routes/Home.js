import React, { useEffect, useState } from 'react';
import {db, storage} from 'fbase';
import { collection, addDoc , query ,orderBy, getDocs, onSnapshot} from "firebase/firestore";
import Tweet from 'components/Tweet';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetFactory from 'components/TweetFactory';
import Tweets from 'components/Tweets';

function Home({userObj}) {
  //console.log(userObj);
  
  const [tweets, setTweets] = useState([]);
  

/*
  const getTweets = async () => {
    const q = query(collection(db, "tweets"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, " => ", doc.data());
      //setTweets(prev => [doc.data(), ...prev])//새 트윗을 가장 먼저 보여준다.
      const tweetObject = {...doc.data(), id:doc.id }//id 추가
      setTweets(prev => [tweetObject, ...prev]);
    });
  }
*/

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

  //console.log(tweets);
  
  

  return (
    <>
    <TweetFactory userObj={userObj} />
    <div>
      {tweets.map(tweet => (
        <Tweet 
          key={tweet.id}
          tweetObj={tweet}
          isOwner={tweet.createId === userObj.uid}
      
        />
      ))}
    </div>
    {/* <Tweets userObj={userObj} /> */}
    </>
  )
}

export default Home