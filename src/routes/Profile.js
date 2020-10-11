import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
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
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(nweets.docs.map((doc) => doc.data()));
    }
    useEffect(() => {
        getMyNweets();
    }, []);
    return (
    <>
    <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} />
        <input type="submit" value="Update Profile" />
    </form>
        <button onClick={onLogOutClick}>Logout</button>
    </>
    );
};

export default Profile;
