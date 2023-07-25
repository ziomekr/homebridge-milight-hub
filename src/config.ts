import { PlatformConfig } from 'homebridge';

export interface Config extends PlatformConfig {
  name?: string;
  bridge?: BridgeConfiguration;
}
export interface BridgeConfiguration {
  name: string;
  ip: string;
  delay: number;
  zones: ZoneConfiguration[];
}
export interface ZoneConfiguration{
    name: string;
    zone: number;
}