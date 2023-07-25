import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import MilightHub from './accesories/MilightBulb/MilightHub';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, MilightHub);
};
