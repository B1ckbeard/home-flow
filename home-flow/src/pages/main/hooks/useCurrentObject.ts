import { useState, useMemo } from "react";
import type { Object } from "@/shared/interfaces/types";

export const useCurrentObject = (objects: Object[]) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentObject = useMemo(() => {
    if (selectedId) {
      const selected = objects.find((obj) => obj._id === selectedId);
      if (selected) return selected;
    }
    return objects[0] || null;
  }, [objects, selectedId]);

  const setCurrentObject = (obj: Object | null) => {
    setSelectedId(obj?._id || null);
  };

  return {
    currentObject,
    setCurrentObject,
  };
};
