export function mapObject(obj, callback){
  return Object.keys(obj).map( (key) => {
    return callback(obj[key], key);
  });
}

export function values(obj){
  return Object.keys(obj).map( (key) => {
    return obj[key];
  });
}

export function omit(obj, omitKeys){
  if (typeof omitKeys === 'string') omitKeys = [omitKeys];
  var retObj = {};
  Object.keys(obj)
    .filter( (key) => {
      return (omitKeys.indexOf(key) === -1);
    }).forEach( (key) => {
      retObj[key] = obj[key];
    });
  return retObj;
}
