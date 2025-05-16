import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-[#C8A846] hover:bg-[#C8A846] text-white font-medium rounded-md transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound;
