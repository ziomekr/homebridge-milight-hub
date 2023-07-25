import {
  API,
  Logger,
  PlatformAccessory,
  Service,
  Characteristic,
} from 'homebridge';
import { Config, ZoneConfiguration } from '../../config';
import { PLATFORM_NAME, PLUGIN_NAME } from '../../settings';
import { MiLightZone } from './MilightZone';
export default class MilightHub{
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  public readonly accessories: PlatformAccessory[] = [];
  constructor(
    public readonly log: Logger,
    public readonly config: Config,
    public readonly api: API,
  ){
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      this.initializeZones();
    });
  }

  public configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    const zone = accessory.context.zone as MiLightZone;
    console.log('LOADING THIS SHIEET');
    console.log(JSON.stringify(zone.zone));
    const existingZone = new MiLightZone(
      this.api,
      this.config.bridge?.ip ?? '',
      this.config.bridge?.delay ?? 25,
      zone.zone);
    existingZone.initialize(accessory);
    this.accessories.push(accessory);
  }

  private initializeZones(): void{
    this.config.bridge?.zones.forEach(zone => {
      if(!(this.accessories.find(accessory => {
        const foundZone = accessory.context.zone as MiLightZone;
        return Number(foundZone.zone.zone) === Number(zone.zone);
      }))){
        console.log('NEW ACC');
        console.log(JSON.stringify(zone));

        const newId = this.api.hap.uuid.generate(zone.name);
        const newZoneAccessory = new this.api.platformAccessory(zone.name, newId);
        const newZone = new MiLightZone(
          this.api,
          this.config.bridge?.ip ?? '',
          this.config.bridge?.delay ?? 25,
          zone);
        newZone.initialize(newZoneAccessory);
        this.accessories.push(newZoneAccessory);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [newZoneAccessory]);
      }
    });
  }
}
