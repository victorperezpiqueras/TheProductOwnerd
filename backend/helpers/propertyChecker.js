/* if all the string properties are  properties of the object it returns true, else returns false */
const propertyChecker = (object, propertyList) => {
  var boolean = true;
  propertyList.forEach(property => {
    if (!object.hasOwnProperty(property)) boolean = false;
  });
  return boolean;
};

module.exports = { propertyChecker };
