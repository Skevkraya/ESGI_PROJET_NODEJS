export type Device = {
  deviceId: string;
  name: string;
  type: string;
  deviceAccessKey: string;
  status: Status;//le redefinir comme enum
  createdAt: Date;
};
export type Status="pending"|"active"|"revoked"

export type Telemetry = {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  battery?: number;
};
