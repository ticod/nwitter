import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            if(newAccount){
                // create account
                await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // login
                await authService.signInWithEmailAndPassword(email, password);
            }
        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <>
        <form onSubmit={onSubmit} className="container">
            <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={onChange}
                className="authInput"
            />
            <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                requiredvalue={password} 
                className="authInput"
                onChange={onChange}
            />
            <input 
                type="submit" 
                className="authInput authSubmit"
                value={newAccount ? "Create Account" : "Login"}/>
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">
            {newAccount ? "Login" : "Create Account"}
        </span>
        </>
    );
};

export default AuthForm;