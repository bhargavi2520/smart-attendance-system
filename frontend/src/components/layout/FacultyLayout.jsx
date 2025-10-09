// File: src/layouts/FacultyLayout.jsx (Refactored to use MainLayout)

import MainLayout from "./MainLayout";

const FacultyLayout = () => {
  // All the layout logic is now handled by MainLayout.
  // The Sidebar component will automatically show the correct links for the faculty role.
  return <MainLayout />;
};

export default FacultyLayout;
