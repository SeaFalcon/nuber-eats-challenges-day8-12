import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from 'src/users/entities/users.entity';

@InputType()
export class SeeProfileInput extends PickType(User, ['id']) {}
