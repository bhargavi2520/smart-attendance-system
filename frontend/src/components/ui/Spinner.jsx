const Spinner = ({ className = "" }) => {
  // Center the spinner vertically within the app area on small screens by
  // providing a responsive minimum height. Callers can override via className.
  return (
    <div
      className={`flex items-center justify-center min-h-[50vh] md:min-h-[45vh] ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );
};

export default Spinner;
