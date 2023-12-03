import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export interface UserInfoDto {
  id: number;
  email: string;
  userName: string;
  bio?: string;
}

export class CreateUserDto extends createZodDto(
  z.object({
    email: z.string().email(),
    userName: z.string().min(4).max(50),
    passWord: z
      .string()
      .min(8),
  })
) {}

export class SignInUserDto extends createZodDto(
  z.object({
    user: z.union([z.string().min(4).max(50), z.string().email()]),
    passWord: z.string(),
  })
) {}
