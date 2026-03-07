import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  async hash(password: string): Promise<string> {
    try {
      const options = {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64мб
        timeCost: 3, // 3 итерации
        parallelism: 1, // количество потоков
        hashLength: 32, // длина хэша
      };

      return await argon2.hash(password, options);
    } catch (error) {
      throw new Error('Ошибка при хошировании пароля');
    }
  }

  async compare(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
}
