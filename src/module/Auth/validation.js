import { z } from 'zod';

// ---------- User Validation ----------
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  accountStatus: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED', 'DELETED']),
  isEmailVerified: z.boolean(),
  emailVerifiedAt: z.date(),
});

// ---------- AuthCredential Validation ----------
export const authCredentialSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['PASSWORD']),
  identifier: z.string().min(3),
  secretHash: z.string().min(6),
  failedAttempts: z.number().int().nonnegative(),
  lockedUntil: z.date(),
  lastLogin: z.date()
});

// ---------- RefreshToken Validation ----------
export const refreshTokenSchema = z.object({
  id: z.string().uuid().optional(),
  sessionId: z.string().uuid(),
  tokenHash: z.string().min(10),
  expiresAt: z.date(),
  revokedAt: z.date().optional(),
});

// ---------- AuthSession Validation ----------
export const authSessionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  revokedAt: z.date().optional(),
});

// ---------- VerificationToken Validation ----------
export const verificationTokenSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET']),
  tokenHash: z.string().min(10),
  expiresAt: z.date(),
  usedAt: z.date().optional(),
});

// ---------- Role Validation ----------
export const roleSchema = z.object({
  id: z.string().uuid().optional(),
  roleName: z.enum(['STUDENT', 'TEACHER']),
  description: z.string().optional(),
});

// ---------- Permission Validation ----------
export const permissionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
});

// ---------- RolePermission Validation ----------
export const rolePermissionSchema = z.object({
  id: z.string().uuid().optional(),
  roleId: z.string().uuid(),
  permissionId: z.string().uuid(),
});

// ---------- UserRole Validation ----------
export const userRoleSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});
