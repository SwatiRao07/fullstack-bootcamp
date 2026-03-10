import React from "react";
import type { User } from "../../../types";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="user-profile">
      <div className="avatar-container">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="avatar" />
        ) : (
          <div className="avatar-placeholder">{user.name.charAt(0)}</div>
        )}
      </div>
      <div className="user-details">
        <h4>{user.name}</h4>
        <p className="email">{user.email}</p>
        <span className="role-badge">{user.role}</span>
      </div>
    </div>
  );
};
