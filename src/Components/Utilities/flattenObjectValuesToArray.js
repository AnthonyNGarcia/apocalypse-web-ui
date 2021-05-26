const convertFlatObjectValuesToArray = (flatObject) => {
  const array = [];
  for (const key in flatObject) {
    if (Object.prototype.hasOwnProperty.call(flatObject, key)) {
      array.push(flatObject[key]);
    }
  }
  return array;
};

export default convertFlatObjectValuesToArray;
