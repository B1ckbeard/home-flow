import type { User } from "../interfaces/types";

const getUser = () => {
  try {
    const userDataString = localStorage.getItem("homeFlowUser");
    if (userDataString) {
      const userData: User = JSON.parse(userDataString);
      if (userData.token) {
        return {
          username: userData.username,
          userId: userData.userId,
          token: userData.token,
        };
      }
    }
  } catch (error) {
    console.error("Failed to initialize user state:", error);
  }
  return null;
};

export { getUser };
