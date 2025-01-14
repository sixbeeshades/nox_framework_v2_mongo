import { prop, getModelForClass } from '@typegoose/typegoose';
import { ParentSchema } from '../../../../core/modules/mongo/parent-schema';
import { ILoginLog } from './loginLog.type';

export class LoginLog extends ParentSchema implements ILoginLog {
  @prop({ type: String })
  public user_id!: string;

  @prop({ type: String })
  public user_name!: string;
}

export const LoginLogModel = getModelForClass(LoginLog);
