import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
};

export const IsLoadingWrapper = ({ isLoading, children }: Props) => {
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
  ) : (
    children
  );
};

export default IsLoadingWrapper;
