import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/podcast/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  Host,
  Listener,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @IsString()
  @Field(() => String)
  email: string;

  @Column()
  @IsString()
  @Field(() => String)
  password: string;

  // @Column({ type: 'string', enum: UserRole })
  @Column()
  @IsEnum(UserRole)
  @Field(() => UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(input: string): Promise<boolean> {
    try {
      return await bcrypt.compare(input, this.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
``;
