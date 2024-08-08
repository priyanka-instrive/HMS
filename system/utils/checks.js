const isArray = (a) => !!a && a.constructor === Array;

const isEmptyArray = (a) => a.length === 0;

module.exports = {
  isArray,
  isEmptyArray,
};
