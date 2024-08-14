import { fileValues } from "../src/components/loanapplication/loanform/formInitialValue";
import { base64ToFile, fileToBase64 } from "./fileStringConversion";

export const storeInLocalStorage = ({ key, value }) => {
  let nonFileFields = {};
  Object.keys(value).map((fieldKey) => {
    if (fileValues.includes(fieldKey)) {
      value[fieldKey] && saveFile(fieldKey, value[fieldKey]);
    } else {
      nonFileFields[fieldKey] = value[fieldKey];
    }

    localStorage.setItem(key, JSON.stringify(nonFileFields));
  });
};

export const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const deleteFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getFile = (key, filename) => {
  console.log(key, filename);
  const base64File = localStorage.getItem(key);
  return base64File ? base64ToFile(base64File, filename) : null;
};

export const saveFile = async (key, file) => {
  const base64File = await fileToBase64(file);
  localStorage.setItem(key, base64File);
};
