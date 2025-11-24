import { React, useState } from "react";
import AccountMenu from "../pages/AccountMenu";

// export default function MainLayout({ children }) {
//   return (
//     // <div className="min-h-screen  bg-gray-100">
//     //   <div className="flex flex-col items-center py-4">
//     //     <AccountMenu />
//     //     <div className="w-full max-w-3xl mt-4">{children}</div>
//     //   </div>
//     // </div>
//     <div className="min-h-screen w-full flex bg-blue-50">
//       {/* Sidebar */}
//       <div className="hidden md:block w-72 p-6">
//         <AccountMenu />
//       </div>
//       {/* Main Dashboard Content */}
//       <div className="flex-1">{children}</div>
//     </div>
//   );
// }

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-blue-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-72 p-6 sticky top-0 h-screen">
        <AccountMenu />
      </div>
      {/* Sidebar Drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-80 bg-gray-100 opacity-97 shadow p-6">
            <AccountMenu />
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setSidebarOpen(false)}
            >
              Close
            </button>
          </div>
          <div
            className="flex-1 bg-gray-900 opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden absolute top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6 text-blue-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
// This component serves as the main layout for the application.
// It includes the AccountMenu for user account actions and wraps the main content area.
// The layout is styled to be responsive and centered, providing a consistent look across different pages.
// The `children` prop allows this layout to wrap any page content, making it reusable across the app.
// The `AccountMenu` component is included at the top, providing user-specific actions like logout.
// The `max-w-3xl` class sets a maximum width for the main content area, ensuring it doesn't overflow on smaller screens.
// The `mt-4` class adds some spacing between the AccountMenu and the main content area.
