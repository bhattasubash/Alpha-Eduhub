import prisma from "@/lib/prisma";
import {
  hashRefreshToken,
  refreshTokenExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";

export async function rotateRefreshToken(oldToken: string) {
  const payload = await verifyRefreshToken(oldToken);
  if (!payload) return null;

  const tokenHash = await hashRefreshToken(oldToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { OR: [{ tokenHash }, { token: oldToken }] },
  });
  if (!stored || stored.expiresAt <= new Date()) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive || user.id !== stored.userId) return null;

  const tokenPayload = {
    userId: payload.userId,
    role: payload.role,
    schoolId: payload.schoolId,
    username: payload.username,
  };
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ]);
  const newTokenHash = await hashRefreshToken(refreshToken);

  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: stored.id } }),
    prisma.refreshToken.create({
      data: { tokenHash: newTokenHash, userId: user.id, expiresAt: refreshTokenExpiryDate() },
    }),
  ]);

  return { accessToken, refreshToken };
}
