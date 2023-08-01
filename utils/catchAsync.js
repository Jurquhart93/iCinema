// module.exports = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch(next);
//   };
// };

module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => {
      // Handle the error here
      // For example, you can log the error for debugging purposes
      console.error('Async function error:', error);
      // Then pass the error to Express error-handling middleware
      next(error);
    });
  };
};
