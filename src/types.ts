export type Device = {
  deviceId: string;
  name: string;
  type: string;
  deviceAccessKey: string;
  status: string;
  createdAt: Date;
};

export type Telemetry = {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  battery?: number;
};
