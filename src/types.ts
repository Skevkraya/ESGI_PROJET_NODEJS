export type Device = {
  deviceId: string;
  name: string;
  type: string;
  deviceAccessKey: string;
  status: string;//le redefinir comme enum
  createdAt: Date;
};
