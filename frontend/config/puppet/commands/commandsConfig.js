module.exports = () => {
  let lastAction = '';

  return {
    updateLastAction: (newValue) => {
      lastAction = newValue ? `_${newValue.toLowerCase()}` : "";
    },

    commands: (page) => {
      return {
        HOVER: async (config) => {
          await page.hover(config.value);
        },

        CLICK: async (config) => {
          await page.click(config.value);
        },

        WAIT: async (config) => {
        if (parseInt(config.value)) {
          await page.waitFor(parseInt(config.value));
        } else {
          await page.waitFor(() => !!document.querySelector(config.value), config.value);
        }
        },

        ENTER_TEXT: async (config) => {
          await page.type(config.textTarget, config.value)
        },

        NAVIGATE: async (config) => {
          await page.goto(`https://${config.url}`, { waituntil: 'networkidle0' });
        },

        REPLACE: async (config) => {
          await page.evaluate((config) => {
              document.querySelector(config.replaceTarget).innerHTML = config.value;
          }, config);
        },

        REPLACE_ALL: async (config) => {
          await page.evaluate((config) => {
              document.querySelectorAll(config.replaceTargetAll).forEach((element) => {
                  element.innerHTML = config.value;
              });
          }, config);
        },

        HIDE: async (config) => {
          await page.evaluate((config) => {
              config.hideTargets.split(',').forEach((selector) => {
                  document.querySelectorAll(selector.trim()).forEach((element) => {
                      element.style.visibility = 'hidden';
                  });
              })
          }, config);
        },

        SCREENSHOT: async (config) => {
          const ssImageName = `${config.testName}${lastAction || '_ss'}.jpg`;
          const ssConfig = {
              path: `./public/${ssImageName}`,
              fullPage: config.fullPageChecked
          };

          if (config.crop && config.cropTarget) {
              const element = await page.$(config.cropTarget);
              await element.screenshot(ssConfig);
          } else {
              await page.screenshot(ssConfig);
          }

          return ssImageName;
        }
      }
    }
  }
};
