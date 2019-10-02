import { Page } from "puppeteer";

export default async (page: Page) => {
  page.on("request", request => {
    if ("image".indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
};
