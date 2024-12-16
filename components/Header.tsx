import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import avatar from "../assets/avatar.jpg";

const Header = () => {
  return (
    <StyledHeader>
      <LogoContainer>
        <LogoImg src={logoImage}></LogoImg>
      </LogoContainer>

      <RightSection>
        <ProfileContainer>
          <Avatar src={avatar} alt="User Avatar" />
          <ProfileInfo>
            <UserName>Admin</UserName>
            <UserRole>Administrator</UserRole>
          </ProfileInfo>
        </ProfileContainer>
      </RightSection>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background-color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  height: 70px;
  z-index: 1030;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 30px;
`;

const Logo = styled.h1`
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 30px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 24px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f6f8;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const UserRole = styled.span`
  font-size: 12px;
  color: #7f8c8d;
`;

const LogoImg = styled.img`
  height: 40px;
  width: auto;
  margin-right: 10px;
`;

export default Header;
