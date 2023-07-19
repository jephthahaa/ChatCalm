import React from "react";
import More from "../img/moreIcon.png";
import Messages from "./Messages"; 
import Input from "./Input";


const Chat = () => {
    return(
        <div className="chat">
            <div className="chatInfo">
                <span>Username</span>
                <div className="chatIcons">
                <img src={More} alt="more"/>
                </div>
            </div>
            <Messages/>
            <Input/>
            
        </div>
    )
}

export default Chat;