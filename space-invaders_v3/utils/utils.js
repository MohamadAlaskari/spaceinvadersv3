export const getWindowWidthAndHeight = () => [
    window.innerWidth || document.documentElement.clientWidth,
    window.innerHeight || document.documentElement.clientHeight,
  ];