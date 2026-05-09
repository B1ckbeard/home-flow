import { useCallback } from "react";
import type { Object, Meter } from "@/shared/interfaces/types";
import {
  useSaveObjectMutation,
  useDeleteObjectMutation,
  useCreateIndicationMutation,
  useDeleteIndicationMutation,
  useUpdateObjectMetersMutation,
} from "@/app/store/api";

interface UseMainPageHandlersProps {
  userId: string | undefined;
  currentObject: Object | null;
  selectedObjectForConfig: Object | null;
  setCurrentObject: (obj: Object | null) => void;
  setShowMetersManager: (show: boolean) => void;
  setSelectedObjectForConfig: (obj: Object | null) => void;
  refetchObjects: () => void;
  refetchCurrentObject: () => void;
  refetchIndications: () => void;
}

export const useMainPageHandlers = ({
  userId,
  currentObject,
  selectedObjectForConfig,
  setCurrentObject,
  setShowMetersManager,
  setSelectedObjectForConfig,
  refetchObjects,
  refetchCurrentObject,
  refetchIndications,
}: UseMainPageHandlersProps) => {
  // Мутации
  const [saveObject] = useSaveObjectMutation();
  const [deleteObject] = useDeleteObjectMutation();
  const [createIndication] = useCreateIndicationMutation();
  const [deleteIndication] = useDeleteIndicationMutation();
  const [updateObjectMeters] = useUpdateObjectMetersMutation();

  const handleObjectSelect = useCallback(
    (obj: Object) => {
      setCurrentObject(obj);
      setShowMetersManager(false);
      setSelectedObjectForConfig(null);
    },
    [setCurrentObject, setShowMetersManager, setSelectedObjectForConfig],
  );

  const handleConfigureMeters = useCallback(
    (obj: Object) => {
      setSelectedObjectForConfig(obj);
      setShowMetersManager(true);
    },
    [setSelectedObjectForConfig, setShowMetersManager],
  );

  const handleObjectSave = useCallback(
    async (name: string) => {
      if (!userId) {
        throw new Error("Пользователь не авторизован");
      }

      const defaultMeters: Meter[] = [
        {
          name: "Электричество",
          unit: "кВт⋅ч",
          type: "electricity",
          rate: 5.38,
          hasSewage: false,
          sewageRate: 0,
        },
        {
          name: "Вода",
          unit: "м³",
          type: "water",
          rate: 35.4,
          hasSewage: true,
          sewageRate: 25.12,
        },
      ];

      try {
        await saveObject({
          name,
          userId,
          meters: defaultMeters,
        }).unwrap();

        refetchObjects();
      } catch (error) {
        console.error("Ошибка при создании объекта:", error);
        throw error;
      }
    },
    [userId, saveObject, refetchObjects],
  );

  const handleObjectDelete = useCallback(async () => {
    if (!currentObject?._id) return;

    try {
      await deleteObject(currentObject._id).unwrap();
      refetchObjects();
      setCurrentObject(null);
    } catch (error) {
      console.error("Ошибка при удалении объекта:", error);
      throw error;
    }
  }, [currentObject, deleteObject, refetchObjects, setCurrentObject]);

  const handleSaveIndication = useCallback(
    async (values: { meterId: string; value: number }[], date: string) => {
      if (!currentObject?._id) return;

      try {
        await createIndication({
          date,
          values,
          objectId: currentObject._id,
        }).unwrap();

        refetchIndications();
      } catch (error) {
        console.error("Ошибка при сохранении показания:", error);
        throw error;
      }
    },
    [currentObject, createIndication, refetchIndications],
  );

  const handleDeleteIndication = useCallback(
    async (id: string) => {
      if (!currentObject?._id) return;

      try {
        await deleteIndication(id).unwrap();
        refetchIndications();
      } catch (error) {
        console.error("Ошибка при удалении показания:", error);
        throw error;
      }
    },
    [currentObject, deleteIndication, refetchIndications],
  );

  const handleMetersChange = useCallback(
    async (updatedMeters: Meter[]) => {
      if (!selectedObjectForConfig?._id) return;

      try {
        await updateObjectMeters({
          id: selectedObjectForConfig._id,
          meters: updatedMeters,
        }).unwrap();

        if (currentObject?._id === selectedObjectForConfig._id) {
          refetchCurrentObject();
        }

        refetchObjects();
        setShowMetersManager(false);
        setSelectedObjectForConfig(null);
      } catch (error) {
        console.error("Ошибка при обновлении счетчиков:", error);
        throw error;
      }
    },
    [
      selectedObjectForConfig,
      currentObject,
      updateObjectMeters,
      refetchCurrentObject,
      refetchObjects,
      setShowMetersManager,
      setSelectedObjectForConfig,
    ],
  );

  const handleCloseMetersManager = useCallback(() => {
    setShowMetersManager(false);
    setSelectedObjectForConfig(null);
  }, [setShowMetersManager, setSelectedObjectForConfig]);


  return {
    handleObjectSelect,
    handleConfigureMeters,
    handleObjectSave,
    handleObjectDelete,
    handleSaveIndication,
    handleDeleteIndication,
    handleMetersChange,
    handleCloseMetersManager,
  };
};
