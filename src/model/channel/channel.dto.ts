import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export class CreateChannelDto extends createZodDto(
  z.object({
    name: z.string().min(3).max(64),
    participants: z.array(z.number()).min(2),
  })
) {}