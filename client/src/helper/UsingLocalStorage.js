import { useState, useEffect } from "react";

export const UsingLocalStorage = (itemName) => {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(itemName);
    try {
      const parsedValue = JSON.parse(savedValue);
      return parsedValue;
    } catch (error) {
      return savedValue;
    }
  });

  useEffect(() => {
    const convertValue = JSON.stringify(value);
    localStorage.setItem(itemName, convertValue);
  }, [value]);

  return [value, setValue];
};
