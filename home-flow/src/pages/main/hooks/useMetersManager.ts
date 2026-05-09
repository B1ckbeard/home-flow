import { useState } from "react";
import type { Object } from "@/shared/interfaces/types";

export const useMetersManager = () => {
  const [showMetersManager, setShowMetersManager] = useState(false);
  const [selectedObjectForConfig, setSelectedObjectForConfig] =
    useState<Object | null>(null);

  return {
    showMetersManager,
    setShowMetersManager,
    selectedObjectForConfig,
    setSelectedObjectForConfig,
  };
};
