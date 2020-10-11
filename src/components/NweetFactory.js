import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        if (nweet === "") {
            return;
        }
        let attachmentUrl = "";
        if (attachment !== "") {
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await fileRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(), 
            creatorId: userObj.uid,
            attachmentUrl, 
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { 
            target: {value}
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }, 
            } = finishedEvent;
            setAttachment(result)
        };
        reader.readAsDataURL(theFile);
    }
    const onClearPhotoClick = () => {
        setAttachment(null);
    }
    return (
        <form onSubmit={onSubmit}>
            <input value={nweet} type="text" placeholder="What' on your mind?" maxLength={120} onChange={onChange} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="profile" />
                    <button onClick={onClearPhotoClick}>Clear</button>
                </div>
            )}
        </form>
    )
};

export default NweetFactory;