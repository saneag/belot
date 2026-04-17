export const isMobile = () => {
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;

  return isMobileDevice || isSmallScreen;
};
