module.exports = (promise) => {
  if (promise.then && promise.catch) {
    return promise
      .then((data) => [null, data])
      .catch((err) => {
        console.error(err);
        if (err.message) {
          return [err.message];
        } else {
          return [err];
        }
      });
  } else if (typeof promise !== "function") {
    return [null, promise];
  } else {
    return ["Not a promise, not a result!"];
  }
};
