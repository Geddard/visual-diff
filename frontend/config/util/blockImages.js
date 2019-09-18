const blockImages = async page => {
  page.on("request", request => {
    if ("image".indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
};

module.exports = blockImages;
