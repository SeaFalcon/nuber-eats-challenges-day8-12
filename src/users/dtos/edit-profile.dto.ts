import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { User } from 'src/users/entities/users.entity';

@InputType()
export class EditProfileInput extends PartialType(User) {}
