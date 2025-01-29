import styled from 'styled-components';
import {Link} from "react-router-dom";

// Styled header container
export const HeaderContainer = styled.header`
  background-color: #282c34;
  color: white;
  padding: 1rem;
  text-align: center;
`;

// Styled title
export const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

// Styled navigation container
export const Nav = styled.nav`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Styled navigation links
export const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #61dafb;
  }
`;
