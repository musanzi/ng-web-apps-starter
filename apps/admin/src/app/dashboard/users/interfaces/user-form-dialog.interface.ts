import { IRole, IUser } from '@libs/utils';

export interface IUserFormDialogData {
  roles: IRole[];
  user?: IUser;
}
