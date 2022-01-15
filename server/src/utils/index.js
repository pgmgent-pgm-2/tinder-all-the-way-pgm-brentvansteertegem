const convertArrayToPagedObject = (arr, itemsPerPage, currentPage) => ({
  pageing: {
    itemsPerPage: parseInt(itemsPerPage, 10) || 10,
    currentPage: parseInt(currentPage, 10) || 1,
    totalPages: Math.ceil(arr.length / itemsPerPage),
    totalItems: arr.length,
  },
  results: arr.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage),
});

const handleHTTPError = (error, next) => next(error);

function HTTPError(message, statusCode) {
  const instance = new Error(message);
  instance.statusCode = statusCode;

  return instance;
}

module.exports = {
  convertArrayToPagedObject,
  handleHTTPError,
  HTTPError,
};
