// Why do I exist? 🤔
async function getNav() {
  return;
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */

//Why am I a bad function? 😭
// Util.handleErrors = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

//temporary fix for the bad function above
const handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  handleErrors,
  getNav,
};
