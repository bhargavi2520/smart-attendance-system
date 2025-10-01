// src/pages/SelectRole.jsx

import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SelectRole = () => {
  const { user, setActiveRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Or a loading spinner/redirect
  }

  const handleRoleSelect = (roleName) => {
    setActiveRole(roleName);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
        <p className="text-gray-600 mb-8">
          Please choose the role you want to use for this session.
        </p>
        <div className="space-y-4">
          {user.roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold uppercase hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
