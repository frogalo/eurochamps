import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import {
    LoginContainer,
    Title,
    UserList,
    UserListItem,
    UserButton,
    NewUserButton,
} from "./Login.styles";
import NewUserModal from "../elements/modals/NewUserModal"; // Import the modal component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'; // Import the plus icon
import { fetchUsers, addUser } from "../api/users"; // Import the fetchUsers and addUser functions

const Login = () => {
    const { setUser, setRole } = useUser(); // Access the setUser function from context
    const [users, setUsers] = useState([]); // State to store users
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        // Fetch users from the API
        const loadUsers = async () => {
            try {
                const data = await fetchUsers(); // Use the fetchUsers function
                setUsers(data); // Set the fetched array directly
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        loadUsers();
    }, []); // Empty dependency array means this runs once on mount

    const handleLogin = (name, role) => {
        setUser(name); // Set the selected user in context and localStorage
        setRole(role); // Set the selected user in context and localStorage
    };

    const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));

    const handleUserAdded = async (newUserName) => {
        try {
            await addUser(newUserName); // Call the API to add the user
            setIsModalOpen(false); // Close the modal
            // Reload the user list
            const data = await fetchUsers(); // Fetch updated user list
            setUsers(data); // Update the users state
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <LoginContainer>
            <Title>Wybierz swoje imię</Title>
            <UserList>
                {sortedUsers.map((user) => (
                    <UserListItem key={user.name}>
                        <UserButton onClick={() => handleLogin(user.name, user.isAdmin)}>
                            {user.name}
                        </UserButton>
                    </UserListItem>
                ))}
            </UserList>

            <NewUserButton onClick={() => setIsModalOpen(true)}>
                <FontAwesomeIcon icon={faPlusCircle} /> Dodaj nową osobę
            </NewUserButton>

            <NewUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={handleUserAdded} // Pass the handler to the modal
            />
        </LoginContainer>
    );
};

export default Login;
