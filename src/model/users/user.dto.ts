import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export interface UserInfoDto {
  id: number;
  email: string;
  userName: string;
  bio?: string;
  imageUrl?: string;
}

export class CreateUserDto extends createZodDto(
  z.object({
    email: z.string().email(),
    userName: z.string().min(4).max(50),
    password: z.string().min(8),
  })
) {}

export class UpdateUserDto extends createZodDto(
  z
    .object({
      email: z.string().email().optional(),
      userName: z.string().min(4).max(50).optional(),
      bio: z.string().optional(),
      imageUrl: z.string().url().optional(),
    })
    .refine(
      (data) => {
        return !data.email && !data.userName && !data.bio && !data.imageUrl;
      },
      { message: 'At least one field must be provided' }
    )
) {}

export class SignInUserDto extends createZodDto(
  z.object({
    user: z.union([z.string().min(4).max(50), z.string().email()]),
    password: z.string(),
  })
) {}
