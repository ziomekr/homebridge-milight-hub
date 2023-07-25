import { MilightController, commandsV6 as Commands } from 'node-milight-promise';

export interface ILightBulbController {
  turnOn(): Promise<void>;
  turnOff(): Promise<void>;
  setBrightness(brightness: number): Promise<void>;
  setHue(hue: number): Promise<void>;
  setTemperature(temperature: number): Promise<void>;
  setSaturation(saturation: number): Promise<void>;
}

export class LightBulbController implements ILightBulbController {
  private controller: MilightController;
  public zone: number;

  constructor(
    ip: string,
    delay: number,
    zone: number) {
    this.controller = new MilightController({
      ip: ip,
      type: 'v6',
      delayBetweenCommands: delay,
    });
    this.zone = zone;
  }

  async turnOn() {
    await this.controller.sendCommands(Commands.fullColor.on(this.zone));
  }

  async turnOff() {
    await this.controller.sendCommands(Commands.fullColor.off(this.zone));
  }

  async setBrightness(brightness: number) {
    await this.controller.sendCommands(Commands.fullColor.brightness(this. zone, brightness));
  }

  async setHue(hue: number) {
    await this.controller.sendCommands(Commands.fullColor.hue(this.zone, hue));
  }

  async setTemperature(temperature: number) {
    await this.controller.sendCommands(Commands.fullColor.whiteTemperature(this.zone, temperature));
  }

  async setSaturation(saturation: number) {
    await this.controller.sendCommands(Commands.fullColor.saturation(this.zone, saturation, true));
  }
}
