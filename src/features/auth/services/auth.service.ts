import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../../../config/database';
import { env } from '../../../config/env';
import {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from '../../../utils/AppError';
import { RegisterInput, LoginInput, AuthTokens, AuthResponse } from '../types/auth.types';

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'USER', 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });


    const tokens = this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // 3. Check if token expired
      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        throw new UnauthorizedError('Refresh token expired');
      }

      // 4. Generate new tokens
      const tokens = this.generateTokens(decoded.userId, decoded.email, decoded.role);

      // 5. Delete old refresh token and save new one
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      await this.saveRefreshToken(decoded.userId, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private generateTokens(userId: number, email: string, role: string): AuthTokens {
    const payload = { userId, email, role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
  expiresIn: "1h"
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
  expiresIn: "7d"
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: number, token: string): Promise<void> {
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}