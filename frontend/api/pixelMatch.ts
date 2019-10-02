import fs from "fs";
import JPEG from "jpeg-js";
import { PNG } from "pngjs";

import pixelmatch from "pixelmatch";

const compare = (sourceUrl: string, compareUrl: string) => {
  const img1 = JPEG.decode(fs.readFileSync(`./public/${sourceUrl}`));
  const img2 = JPEG.decode(fs.readFileSync(`./public/${compareUrl}`));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(
    `./public/${sourceUrl.replace(".jpg", "")}-${compareUrl.replace(".jpg", "")}-diff.png`,
    PNG.sync.write(diff)
  );

  return diffPixels;
};

export default (app: any) => {
  app.post("/compare", (req: any, res: any) => {
    const diffResult = compare(req.body.sourceUrl, req.body.compareUrl);
    res.json({
      diffResult
    });
  });
};
