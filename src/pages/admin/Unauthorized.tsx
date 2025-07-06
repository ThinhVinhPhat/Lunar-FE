import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Unauthorized</h2>
      <p className="text-gray-600 mb-8">
        You do not have permission to use the site.{" "}
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

export default Unauthorized;
