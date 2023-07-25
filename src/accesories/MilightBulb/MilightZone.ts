import {API, Service, PlatformAccessory, Characteristic, CharacteristicValue } from 'homebridge';
import { ZoneConfiguration } from '../../config';
import { LightBulbController } from './LightBulbController';
export class MiLightZone {

  private controller: LightBulbController;
  private homebridgeService: typeof Service = this.api.hap.Service;
  private homebridgeCharacteristic: typeof Characteristic = this.api.hap.Characteristic;
  constructor(
        private readonly api: API,
        private readonly ip: string,
        private readonly delay: number,
        public readonly zone: ZoneConfiguration,
        private isOn: CharacteristicValue = false,
        private brightness: CharacteristicValue = 0,
        private hue: CharacteristicValue = 0,
        private saturation: CharacteristicValue = 0,
        private temperature: CharacteristicValue = 140,
  ){
    this.controller = new LightBulbController(this.ip, this.delay, this.zone.zone);
  }

  public reinitializeController(): void{
    this.controller = new LightBulbController(this.ip, this.delay, this.zone.zone);
  }

  public initialize(accessory: PlatformAccessory, initializeAdaptiveLighting = true): void{
    let service = accessory.getService(this.homebridgeService.Lightbulb);
    if (typeof service === 'undefined') {
      service = new this.homebridgeService.Lightbulb(accessory.displayName);
      accessory.addService(service);
      accessory.context.zone = this;
      accessory
        .getService(this.homebridgeService.AccessoryInformation)!
        .setCharacteristic(this.homebridgeCharacteristic.Manufacturer, 'Milight')
        .setCharacteristic(this.homebridgeCharacteristic.Model, this.zone.name);
    }
    service.getCharacteristic(this.homebridgeCharacteristic.On)
      // .onGet(() => this.isOn)
      .onSet((newState: CharacteristicValue) => {
        this.isOn = newState;
        this.isOn ? this.controller.turnOn() : this.controller.turnOff();
      });
    service.getCharacteristic(this.homebridgeCharacteristic.Brightness)
      // .onGet(() => this.brightness)
      .onSet((brightness: CharacteristicValue) => {
        this.brightness = brightness;
        this.controller.setBrightness(Number(this.brightness));
      });
    service.getCharacteristic(this.homebridgeCharacteristic.Hue)
      // .onGet(() => this.hue)
      .onSet((hue: CharacteristicValue) => {
        this.hue = hue;
        this.controller.setHue(this.homekitHueToMilight(Number(this.hue)));
      });
    service.getCharacteristic(this.homebridgeCharacteristic.Saturation)
      .onSet((saturation: CharacteristicValue) => {
        this.saturation = saturation;
        this.controller.setSaturation(Number(this.saturation));
      });
    service.getCharacteristic(this.homebridgeCharacteristic.ColorTemperature)
      .onSet((temperature: CharacteristicValue) => {
        this.temperature = temperature;
        this.controller.setTemperature(this.homekitTemperatureToMilight(Number(this.temperature)));
      });
    if(initializeAdaptiveLighting){
      const adaptiveLightcontroller = new this.api.hap.AdaptiveLightingController(service);
      accessory.configureController(adaptiveLightcontroller);
    }
  }

  private homekitHueToMilight(homekitHue: number): number {
    const hue = Math.round((homekitHue * (255 / 360)) + 10) % 255;
    return hue;
  }

  private homekitTemperatureToMilight(homekitTemp: number): number {
    const kelvin = 1000000 / homekitTemp;
    if (kelvin <= 2700) {
      return 0x00;
    } else if (kelvin >= 6500) {
      return 0x64;
    } else {
      const range = 6500 - 2700;
      const mappedValue = Math.round(((kelvin - 2700) / range) * 100);
      return Math.round(mappedValue * 0x64 / 100);
    }
  }
}