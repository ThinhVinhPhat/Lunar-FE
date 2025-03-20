import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type ProfitProps = {
  icon: IconDefinition;
  title: string;
  description: string;
};
export const Profit = ({ icon, title, description }: ProfitProps) => {
  return (
    <div className="flex items-start gap-3">
      <FontAwesomeIcon icon={icon} className="text-[#C8A846] mt-1" />
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
