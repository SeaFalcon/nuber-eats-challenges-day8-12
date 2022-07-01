import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/auth.decorator';
import { MutationOutput } from 'src/common/dtos/output.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from 'src/users/dtos/create-account.dto';
import { EditProfileInput } from 'src/users/dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from 'src/users/dtos/login.dto';
import { SeeProfileInput } from 'src/users/dtos/see-profile.dto';
import { User, UserRole } from 'src/users/entities/users.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  @Roles(UserRole.Listener, UserRole.Host)
  seeProfile(@Args('input') { id }: SeeProfileInput): Promise<User> {
    return this.usersService.seeProfile(id);
  }

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation(() => MutationOutput)
  editProfile(
    @Args('id') id: number,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<MutationOutput> {
    return this.usersService.editprofile(id, editProfileInput);
  }
}
