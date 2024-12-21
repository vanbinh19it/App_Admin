import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import VocabCategory from "./components/vocab.category";
import ListeningCategory from "./components/listening.category";
import Header from "./components/Header";
import styled from "styled-components";

const container = document.getElementById("root");
const root = createRoot(container!);

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1a1a1a;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  margin-top: 30px;
  background-color: #1a1a1a;
  color: #ffffff;
  width: calc(100% - 256px);
`;

root.render(
  <React.StrictMode>
    <Router>
      <AppContainer>
        <Header />
        <ContentWrapper>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/vocabulary/:category" element={<VocabCategory />} />
              <Route path="/listening/:topic" element={<ListeningCategory />} />
            </Routes>
          </MainContent>
        </ContentWrapper>
      </AppContainer>
    </Router>
  </React.StrictMode>
);
