import { useState } from "react";
import { User, Lock, Bell, Save } from "lucide-react";

// Mock data for the faculty user - replace with API call
const mockFacultyData = {
  name: "Dr. Jane Smith",
  email: "jane.smith@example.com",
  department: "Computer Science",
  notifications: {
    weeklySummary: true,
    lowAttendanceAlerts: false,
  },
};

const SettingsInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const SettingsToggle = ({ label, description, id, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <button
      type="button"
      id={id}
      onClick={onChange}
      className={`${
        checked ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={checked}>
      <span
        aria-hidden="true"
        className={`${
          checked ? "translate-x-5" : "translate-x-0"
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

export default function FacultySettingsPage() {
  const [profile, setProfile] = useState(mockFacultyData);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (field) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to save settings would go here
    console.log("Saving faculty settings:", profile);
    alert("Settings saved successfully! (Check console for data)");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
            <User className="w-6 h-6 mr-3 text-gray-500" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <SettingsInput
              label="Full Name"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
            <SettingsInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
            <Lock className="w-6 h-6 mr-3 text-gray-500" />
            Change Password
          </h2>
          <div className="space-y-4">
            <SettingsInput
              label="Current Password"
              id="currentPassword"
              type="password"
              placeholder="••••••••"
            />
            <SettingsInput
              label="New Password"
              id="newPassword"
              type="password"
              placeholder="••••••••"
            />
            <SettingsInput
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
