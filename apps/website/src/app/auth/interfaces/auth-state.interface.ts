import { IAuthProfile } from './auth-profile.interface';

export interface IAuthState {
  user: IAuthProfile | null;
  isVerifying: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
