const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">{children}</div>
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`border-b border-gray-200 px-4 py-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>;
};

export default Card;
