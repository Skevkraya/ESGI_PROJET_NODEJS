export type Device = {
  deviceId: string;
  name: string;
  type: string;
  deviceAccessKey: string;
  status: string;
  createdAt: Date;
};

export type Telemetry = {
  timestamp: Date;
  temperature: number;
  humidity: number;
  motion: number;
  battery: number;
}