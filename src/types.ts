export type Device = {
  deviceId: string;
  name: string;
  type: string;
  deviceAccessKey: string;
  status: Status;//le redefinir comme enum
  createdAt: Date;
};
export type Status="pending"|"active"|"revoked"
