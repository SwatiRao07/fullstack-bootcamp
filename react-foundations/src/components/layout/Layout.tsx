import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1>Book Foundations</h1>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="#library">Library</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="main-content">{children}</div>

      <footer className="footer">
        <p>
          React Foundations Drill &mdash; Built with React 19 + TypeScript +
          Vite
        </p>
      </footer>
    </div>
  );
};
