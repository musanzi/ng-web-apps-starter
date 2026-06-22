import { IRole, IUser } from '@libs/utils';

export interface IUsersState {
  error: string | null;
  isExporting: boolean;
  isImporting: boolean;
  isLoading: boolean;
  limit: number;
  page: number;
  roles: IRole[];
  success: string | null;
  total: number;
  users: IUser[];
}
