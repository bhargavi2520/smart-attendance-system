// File: src/pages/faculty/FacultyReportsPage.jsx (Mobile Responsive)

const FacultyReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          View and download attendance reports
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl sm:text-4xl">📄</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Reports Coming Soon
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            This feature is under development. You'll be able to generate and
            download detailed attendance reports here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyReportsPage;
