import { Page } from "puppeteer";

import commandsConfig, { ICommands } from "./commandsConfig";

const baseCommands = commandsConfig();

export default (page: Page): ICommands => {
  const processedCommands = {};
  const actionsNotRegistered = ["SCREENSHOT", "WAIT"];
  const commands = baseCommands.commands(page);
  const commandWrapper = async (config: any, command: keyof ICommands, shouldSetLastAction: boolean) => {
    const commandConfig = commands[command];

    if (commandConfig !== undefined) {
      const results = await commandConfig(config);
      const lastAction = shouldSetLastAction ? command : "";

      baseCommands.updateLastAction(lastAction);

      return results;
    }
  };

  for (const command in commands) {
    if (commands.hasOwnProperty(command)) {
      const shouldSetLastAction = actionsNotRegistered.indexOf(command) === -1;

      (processedCommands as ICommands)[command] = (config: any) =>
        commandWrapper(config, command as keyof ICommands, shouldSetLastAction);
    }
  }

  return processedCommands as ICommands;
};
