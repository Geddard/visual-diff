const debounce = (callback: (...args: any[]) => any, wait: number) => {
  let timerId: number;

  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      callback(args);
      timerId = 0;
    }, wait);
  };
};

export {
  debounce,
};
