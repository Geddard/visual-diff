import { Response } from "express";

export const trySomething = async (res: Response, tryThis: () => void, catchIt: () => void) => {
  try {
    await tryThis();
  } catch (error) {
    await catchIt();
    res.status(500).json(`Something went wrong: ${error}`);
  }
};
