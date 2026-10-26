export const getItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('LocalStorage remove failed:', e);
  }
};

export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('LocalStorage clear failed:', e);
  }
};
