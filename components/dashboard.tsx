// import React from "react";
// import {
//   CContainer,
//   CSidebar,
//   CSidebarNav,
//   CNavTitle,
//   CNavItem,
//   CNavLink,
//   CNavGroup,
//   CHeader,
//   CNav,
// } from "@coreui/react";
// import "@coreui/coreui/dist/css/coreui.min.css";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import VocabularyManager from "./voca.manager";

// const App: React.FC = () => {
//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Sidebar */}
//       <CSidebar>
//         <CSidebarNav>
//           <CNavTitle>Components</CNavTitle>
//           <CNavGroup toggler="Vocabulary">
//             <CNavItem>
//               <CNavLink href="#">Animals</CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink href="#">Fruits</CNavLink>
//             </CNavItem>
//           </CNavGroup>
//           <CNavGroup toggler="Charts">
//             <CNavItem>
//               <CNavLink href="#">Charts</CNavLink>
//             </CNavItem>
//           </CNavGroup>
//           <CNavGroup toggler="Icons">
//             <CNavItem>
//               <CNavLink href="#">Icons</CNavLink>
//             </CNavItem>
//           </CNavGroup>
//           <CNavItem>
//             <CNavLink href="#">Notifications</CNavLink>
//           </CNavItem>
//         </CSidebarNav>
//       </CSidebar>

//       {/* Main Content */}
//       <div style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
//         {/* Header */}
//         <CHeader className="d-flex justify-content-between align-items-center px-4">
//           <CNav>
//             <CNavItem>
//               <CNavLink href="#">Dashboard</CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink href="#">Users</CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink href="#">Settings</CNavLink>
//             </CNavItem>
//           </CNav>
//           <div>
//             <img
//               src="https://via.placeholder.com/40"
//               alt="Profile"
//               style={{
//                 borderRadius: "50%",
//                 width: "40px",
//                 height: "40px",
//               }}
//             />
//           </div>
//         </CHeader>

//         {/* Main Container */}
//         <CContainer
//           className="mt-4"
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100%",
//           }}
//         >
//           <h1>Welcome to CoreUI Dashboard</h1>
//         </CContainer>
//       </div>
//     </div>
//   );
// };

// export default App;
