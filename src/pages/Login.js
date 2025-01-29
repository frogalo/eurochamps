// src/pages/Login.js
import React from "react";
import { useUser } from "../context/UserContext";
import {
    LoginContainer,
    Title,
    UserList,
    UserListItem,
    UserButton,
} from "./Login.styles";

const Login = () => {
    const { setUser } = useUser(); // Access the setUser function from context

    // Predefined list of users
    const users = ["Iga", "Wiktoria", "Agata", "Kasia", "Kuba", "Rafał"];

    const handleLogin = (name) => {
        setUser(name); // Set the selected user in context and localStorage
    };

    return (
        <LoginContainer>
            <Title>Wybierz swoje imię</Title>
            <UserList>
                {users.map((name) => (
                    <UserListItem key={name}>
                        <UserButton onClick={() => handleLogin(name)}>{name}</UserButton>
                    </UserListItem>
                ))}
            </UserList>
        </LoginContainer>
    );
};

export default Login;
