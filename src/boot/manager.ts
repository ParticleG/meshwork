import { boot } from 'quasar/wrappers';

import crystalSkinImage from 'assets/skin/crystal.png';
import crystalSkinConfig from 'assets/skin/crystal.json';
import { skinManager } from 'types/SkinManager';

export default boot(async () => {
  await skinManager.loadSkin('crystal', {
    src: crystalSkinImage,
    ...crystalSkinConfig,
  });
});
