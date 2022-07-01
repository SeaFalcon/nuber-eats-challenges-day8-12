import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from 'src/users/dtos/create-account.dto';
import { LoginInput, LoginOutput } from 'src/users/dtos/login.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { EditProfileInput } from './dtos/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async seeProfile(id: number): Promise<User> {
    try {
      return this.users.findOne(id);
    } catch (err) {
      console.log(err);
    }
  }

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        where: { email: createAccountInput.email },
      });

      console.log(exists);

      if (exists) {
        return { success: false, error: 'email already exist' };
      }

      const newUser = this.users.create(createAccountInput);
      await this.users.save(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          success: false,
          error: 'user not found',
        };
      }

      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return {
          success: false,
          error: 'wrong password',
        };
      }

      const accessToken = this.jwtService.sign({ id: user.id });

      return {
        success: true,
        accessToken,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  async editprofile(
    id: number,
    editProfileInput: EditProfileInput,
  ): Promise<MutationOutput> {
    try {
      await this.users.update(id, { ...editProfileInput });

      return {
        success: true,
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
        error: err.message,
      };
    }
  }

  async findById(id) {
    return this.users.findOne({ id });
  }
}
