import React from "react";
import { HeaderContainer, Title, NameDiv, LogoutButton } from "./Header.styles";
import { useUser } from "../context/UserContext"; // Import the UserContext
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the logout icon

const Header = () => {
    const { user, setUser } = useUser(); // Access the logged-in user and the setter

    const handleLogout = () => {
        setUser(null); // Clear the user from context
        localStorage.removeItem("user"); // Remove the user from localStorage
    };

    return (
        <HeaderContainer>
            <Title>{user ? "Ranking" : "Etapy"}</Title> {/* Change title based on the page */}
            <NameDiv>
                {user && (
                    <>
                        <span>{user}</span>
                        <LogoutButton onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </LogoutButton>
                    </>
                )}
            </NameDiv>
        </HeaderContainer>
    );
};

export default Header;
