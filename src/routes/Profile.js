import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [nweets, setNweets] = useState([]);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.DisplayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }
    const getMyNweets = async() => {
        dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "desc").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }
    useEffect(() => {
        getMyNweets();
    }, []);
    return (
    <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
            <input 
                onChange={onChange} 
                className="formInput" 
                autoFocus 
                type="text" 
                placeholder="Display Name" 
                value={newDisplayName} 
            />
            <input 
                type="submit" 
                value="Update Profile" 
                className="formBtn" 
                style={{
                    marginTop: 10,
                }} 
            />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
            Log Out
        </span>
        <div className="container profileNweet">
            <div>
                내 글
            </div>
            <div style={{ marginTop: 30 }}>
                {nweets.map((nweet) => (
                    <Nweet 
                        // key={nweet.id} 
                        nweetObj={nweet} 
                        isOwner={nweet.creatorId === userObj.uid} 
                    />
                ))}
            </div>
        </div>
    </div>
    );
};

export default Profile;
