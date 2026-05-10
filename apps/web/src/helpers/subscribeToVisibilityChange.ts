export const subscribeToVisibilityChange = (handleVisibilityChange: () => void) => {
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};
