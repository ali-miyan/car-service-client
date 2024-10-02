import React from "react";
import Header from "../components/user/MainPages/UserNavbar";
import Footer from "../components/user/MainPages/UserFooter";
import { MainLayoutProps } from "../schema/component";

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="scrollable-content no-scrollbar">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
