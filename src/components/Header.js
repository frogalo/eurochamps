import React from 'react';
import { HeaderContainer, Title, Nav, NavLink } from './Header.styles';

const Header = () => {
    return (
        <HeaderContainer>
            <Title>Euro Champs!</Title>
            <Nav>
                <NavLink to='/'>Strona Główna</NavLink>
                <NavLink to='/voting'>Głosuj</NavLink>
                <NavLink to='/leaderboard'>Ranking</NavLink>
                <NavLink to='/profile'>Profil</NavLink>
            </Nav>
        </HeaderContainer>
    );
};

export default Header;
