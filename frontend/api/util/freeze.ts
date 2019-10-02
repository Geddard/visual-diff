import { Page } from "puppeteer";

export default async (page: Page) => {
  await page.addStyleTag({
    content: `
        <style>
            *, *::before, *::after {
                -moz-transition: none !important;
                transition: none !important;
                -moz-animation: none !important;
                animation: none !important;
            }
        </style>
    `
  });
};
