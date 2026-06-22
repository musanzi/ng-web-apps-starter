import { IUserPayload } from './user-payload.interface';

export interface ISaveUserPayload {
  payload: IUserPayload;
  userId?: string;
}
