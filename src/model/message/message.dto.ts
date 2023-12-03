import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const messageSchema = z.string().min(1).max(1024);
