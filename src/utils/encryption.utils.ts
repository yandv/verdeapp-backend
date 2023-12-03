import { hash, compare } from 'bcrypt';

export default class EncryptionUtils {
  private static SALTS_OR_ROUNDS = 10;

  static async encrypt(text: string): Promise<string> {
    return hash(text, this.SALTS_OR_ROUNDS);
  }
  static async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
