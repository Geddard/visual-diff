const commandsConfig = require('./commandsConfig')();

module.exports = (page) => {
  let processedCommands = {};
  const actionsNotRegistered = [
    'SCREENSHOT',
    'WAIT'
  ];
  const commands = commandsConfig.commands(page);
  const commandWrapper = async (config, command, shouldSetLastAction) => {
    const results = await commands[command](config);
    const lastAction = shouldSetLastAction ? command : "";

    commandsConfig.updateLastAction(lastAction);

    return results;
  }

  for (const command in commands) {
    if (commands.hasOwnProperty(command)) {
      const shouldSetLastAction = actionsNotRegistered.indexOf(command) === -1;

      processedCommands[command] = (config) => commandWrapper(config, command, shouldSetLastAction);
    }
  }

  return processedCommands;
};
