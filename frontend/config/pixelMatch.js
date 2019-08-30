const bodyParser = require("body-parser");
const fs = require('fs');
const PNG = require('pngjs').PNG;
const JPEG = require('jpeg-js');

const pixelmatch = require('pixelmatch');

const compare = (sourceUrl, compareUrl) => {
  const img1 = JPEG.decode(fs.readFileSync(`./public/${sourceUrl}`));
  const img2 = JPEG.decode(fs.readFileSync(`./public/${compareUrl}`));
  const {width, height} = img1;
  const diff = new PNG({width, height});

  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

  fs.writeFileSync(
      `./public/${sourceUrl.replace('.jpg', '')}-${compareUrl.replace('.jpg', '')}-diff.png`,
      PNG.sync.write(diff)
  );

  return diffPixels;
};

module.exports = (app) => {
  app.post('/api/compare', bodyParser.json(), (req, res) => {
    const diffResult = compare(req.body.sourceUrl, req.body.compareUrl);
    res.json({
      diffResult
    });
  });
};
