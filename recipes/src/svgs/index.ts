const reqSvgs = require.context('./', true, /\.svg$/);

export const availableIcons = reqSvgs.keys().map(
  key => key.slice(2, -4)
);

const svgs: {
  [key: string]: any
} = reqSvgs
  .keys()
  .reduce<{[key: string]: any}>((images, path) => {
    images[path.slice(2, -4)] = reqSvgs(path)
    return images
  }, {} );

export default svgs;
