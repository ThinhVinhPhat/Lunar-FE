import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "../wrapper/Text";
type UserOptionsProps = {
  isProfileOpen: boolean;
  setIsProfileOpen: (isProfileOpen: boolean) => void;
  navigate: (path: string) => void;
  handleSignOut: () => void;
};

function UserOptions({
  isProfileOpen,
  setIsProfileOpen,
  navigate,
  handleSignOut,
}: UserOptionsProps) {
  return (
    <>
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setIsProfileOpen(false);
              navigate("/profile");
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Text id="user_options.my_profile" />
          </button>
          <button
            onClick={() => {
              setIsProfileOpen(false);
              navigate("/orders");
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Text id="user_options.my_orders" />
          </button>
          <button
            onClick={() => {
              setIsProfileOpen(false);
              handleSignOut();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSignOut} className="mr-2" />
            <Text id="user_options.sign_out" />
          </button>
        </div>
      )}
    </>
  );
}

export default UserOptions;
