import { Page } from "puppeteer";

type TCommandPromise = Promise<string | void>;

export interface ICommands {
  HOVER?: (config: any) => TCommandPromise;
  CLICK?: (config: any) => TCommandPromise;
  WAIT?: (config: any) => TCommandPromise;
  ENTER_TEXT?: (config: any) => TCommandPromise;
  NAVIGATE?: (config: any) => TCommandPromise;
  REPLACE?: (config: any) => TCommandPromise;
  REPLACE_ALL?: (config: any) => TCommandPromise;
  HIDE?: (config: any) => TCommandPromise;
  SCREENSHOT?: (config: any) => TCommandPromise;
}

export interface ICommandsConfig {
  updateLastAction: (newValue: string) => void;
  commands: (page: Page) => ICommands;
}

export default (): ICommandsConfig => {
  let lastAction = "";

  return {
    updateLastAction: (newValue: string) => {
      lastAction = newValue ? `_${newValue.toLowerCase()}` : "";
    },

    commands: (page: Page): ICommands => {
      return {
        HOVER: async (config: any) => {
          await page.hover(config.value);
        },

        CLICK: async (config: any) => {
          await page.click(config.value);
        },

        WAIT: async (config: any) => {
          if (parseInt(config.value)) {
            await page.waitFor(parseInt(config.value));
          } else {
            await page.waitFor(() => !!document.querySelector(config.value), config.value);
          }
        },

        ENTER_TEXT: async (config: any) => {
          await page.type(config.textTarget, config.value);
        },

        NAVIGATE: async (config: any) => {
          await page.goto(`https://${config.url}`, { waitUntil: "networkidle0" });
        },

        REPLACE: async (config: any) => {
          await page.evaluate((replaceConfig: any) => {
            document.querySelector(replaceConfig.replaceTarget).innerHTML = config.value;
          }, config);
        },

        REPLACE_ALL: async (config: any) => {
          await page.evaluate((replaceAllConfig: any) => {
            document.querySelectorAll(replaceAllConfig.replaceTargetAll).forEach(element => {
              element.innerHTML = replaceAllConfig.value;
            });
          }, config);
        },

        HIDE: async (config: any) => {
          await page.evaluate((hideConfig: any) => {
            hideConfig.hideTargets.split(",").forEach((selector: string) => {
              document.querySelectorAll(selector.trim()).forEach((element: Element) => {
                (element as HTMLElement).style.visibility = "hidden";
              });
            });
          }, config);
        },

        SCREENSHOT: async (config: any): Promise<string> => {
          const ssImageName = `${config.testName}${lastAction || "_ss"}.jpg`;
          const ssConfig = {
            fullPage: config.fullPageChecked,
            path: `./public/${ssImageName}`
          };

          if (config.crop && config.cropTarget) {
            const element = await page.$(config.cropTarget);
            if (element !== null) {
              await element.screenshot(ssConfig);
            }
          } else {
            await page.screenshot(ssConfig);
          }

          return ssImageName;
        }
      };
    }
  };
};
