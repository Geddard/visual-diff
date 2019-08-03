const bodyParser = require("body-parser");
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const compare = (sourceUrl, compareUrl) => {
  const img1 = PNG.sync.read(fs.readFileSync(`./public/${sourceUrl}`));
  const img2 = PNG.sync.read(fs.readFileSync(`./public/${compareUrl}`));
  const {width, height} = img1;
  const diff = new PNG({width, height});
  
  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

  fs.writeFileSync(
      `./public/${sourceUrl.replace('.png', '')}-${compareUrl.replace('.png', '')}-diff.png`,
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
