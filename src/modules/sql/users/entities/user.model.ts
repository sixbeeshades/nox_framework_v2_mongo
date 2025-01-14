import {
  Table,
  Model,
  Column,
  DataType,
  Length,
  BeforeCreate,
} from 'sequelize-typescript';
import { generateHash, uuid } from '@src/core/utils/helpers';
import { IUser } from './user.interface';
import sequelizeConnection from '@src/config/sql';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model implements IUser {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  uid!: string;

  @Column({
    type: DataType.STRING,
    comment: 'Tony',
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataType.STRING,
    comment: 'Stark',
    allowNull: false,
  })
  last_name!: string;

  @Column({
    type: DataType.STRING,
    comment: 'Tony Stark',
    allowNull: true,
  })
  full_name!: string;

  @Column({
    type: DataType.STRING,
    comment: 'tony.stark@admin.com',
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    comment: '112233',
    allowNull: true,
  })
  phone_code!: string;

  @Column({
    type: DataType.STRING,
    comment: '9988774455',
    allowNull: false,
  })
  phone!: string;

  @Length({ min: 6 })
  @Column({
    type: DataType.STRING,
    comment: '123456',
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fire_base_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  facebook_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  google_id!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  active!: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  verified!: boolean;
  @Column({
    type: DataType.STRING || DataType.NUMBER,
    allowNull: true,
  })
  created_by!: any;

  @Column({
    type: DataType.STRING || DataType.NUMBER,
    allowNull: true,
  })
  updated_by!: any;

  @Column({
    type: DataType.STRING || DataType.NUMBER,
    allowNull: true,
  })
  deleted_by!: any;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_login_at!: Date;

  @Column({
    type: DataType.DATE,
  })
  deletedAt!: Date;

  @BeforeCreate
  static createUID(instance: User): void {
    instance.uid = uuid();
    instance.verified = false;
    instance.active = true;
  }

  @BeforeCreate
  static createFullName(instance: User): void {
    if (!!instance.first_name && !!instance.last_name)
      instance.full_name = `${instance.first_name} ${instance.last_name}`;
  }

  @BeforeCreate
  static async encryptPassword(instance: User): Promise<void> {
    if (instance.password)
      instance.password = await generateHash(instance.password);
  }
}

sequelizeConnection.addModels([User]);
