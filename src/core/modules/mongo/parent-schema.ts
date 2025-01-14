import { prop, getModelForClass } from '@typegoose/typegoose';

interface IParentSchema {
  active: boolean;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
}

export class ParentSchema implements IParentSchema {
  //   @prop({ type: String, required: true })
  //   public _id!: string;

  @prop({ type: Boolean, required: true, default: true })
  public active!: boolean;

  @prop({ type: Date, required: true, default: Date.now })
  public created_at!: Date;

  // @prop({ type: String, required: true })
  // public created_by!: string;

  @prop({ type: Date, required: true, default: Date.now })
  public updated_at!: Date;

  // @prop({ type: String, required: true })
  // public updated_by!: string;
}
