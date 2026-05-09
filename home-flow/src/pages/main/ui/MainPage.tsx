import styles from "./styles.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUser } from "@/shared/hooks/useAuth";
import {
  useGetUserObjectsQuery,
  useGetObjectByIdQuery,
  useGetObjectIndicationsQuery,
} from "@/app/store/api";
import { AreasSidebar } from "@/components/area";
import { IndicationsContent } from "@/components/indication";
import {
  useCurrentObject,
  useMetersManager,
  useMainPageHandlers,
} from "../hooks";

const MainPage = () => {
  const navigate = useNavigate();
  const userData = getUser();
  const userId = userData?.userId;

  useEffect(() => {
    if (!userData?.token) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const {
    data: objects = [],
    isLoading: isObjectsLoading,
    refetch: refetchObjects,
  } = useGetUserObjectsQuery(userId || "", {
    skip: !userId,
  });

  const { currentObject, setCurrentObject } = useCurrentObject(objects);

  const { data: currentObjectData, refetch: refetchCurrentObject } =
    useGetObjectByIdQuery(currentObject?._id || "", {
      skip: !currentObject?._id,
    });

  const {
    data: indications = [],
    isLoading: isIndicationsLoading,
    refetch: refetchIndications,
  } = useGetObjectIndicationsQuery(currentObject?._id || "", {
    skip: !currentObject?._id,
  });

  const {
    showMetersManager,
    setShowMetersManager,
    selectedObjectForConfig,
    setSelectedObjectForConfig,
  } = useMetersManager();

  const {
    handleObjectSelect,
    handleConfigureMeters,
    handleObjectSave,
    handleObjectDelete,
    handleSaveIndication,
    handleDeleteIndication,
    handleMetersChange,
    handleCloseMetersManager,
  } = useMainPageHandlers({
    userId,
    currentObject,
    selectedObjectForConfig,
    setCurrentObject,
    setShowMetersManager,
    setSelectedObjectForConfig,
    refetchObjects,
    refetchCurrentObject,
    refetchIndications,
  });

  const objectMeters = currentObjectData?.meters || [];

  if (!userData?.token) {
    return null;
  }

  return (
    <div className={styles.mainPage}>
      <AreasSidebar
        objects={objects}
        currentObject={currentObject}
        isLoading={isObjectsLoading}
        onObjectSelect={handleObjectSelect}
        onObjectSave={handleObjectSave}
        onObjectDelete={handleObjectDelete}
        onConfigureMeters={handleConfigureMeters}
      />

      <IndicationsContent
        objects={objects}
        currentObject={currentObject}
        objectMeters={objectMeters}
        indications={indications}
        showMetersManager={showMetersManager}
        selectedObjectForConfig={selectedObjectForConfig}
        isIndicationsLoading={isIndicationsLoading}
        onSaveIndication={handleSaveIndication}
        onDeleteIndication={handleDeleteIndication}
        onMetersChange={handleMetersChange}
        onCloseMetersManager={handleCloseMetersManager}
      />
    </div>
  );
};

export default MainPage;
