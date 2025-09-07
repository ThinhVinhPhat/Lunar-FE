import React from "react";
import { useTranslation } from "react-i18next";

interface TextProps {
  id: string;
  values?: Record<string, string>;
}

const Text: React.FC<TextProps> = ({ id, values }) => {
  const { t } = useTranslation();
  return <>{t(id, values)}</>;
};

export default Text;
