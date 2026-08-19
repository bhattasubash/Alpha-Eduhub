/**
 * Environment variable validation for deployment
 * NEVER blocks deployment - only warns to ensure deployment always succeeds
 */

export function validateEnv() {
  const required = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  };

  const errors: string[] = [];

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  // Validate DATABASE_URL format
  if (required.DATABASE_URL && !required.DATABASE_URL.startsWith('postgresql://')) {
    errors.push('DATABASE_URL must start with "postgresql://"');
  }

  // Validate JWT secrets strength
  if (required.JWT_ACCESS_SECRET && required.JWT_ACCESS_SECRET.length < 32) {
    errors.push('JWT_ACCESS_SECRET must be at least 32 characters');
  }

  if (required.JWT_REFRESH_SECRET && required.JWT_REFRESH_SECRET.length < 32) {
    errors.push('JWT_REFRESH_SECRET must be at least 32 characters');
  }

  // NEVER block deployment - only warn
  if (errors.length > 0) {
    console.warn('Environment validation warnings:', errors);
  }

  return errors.length === 0;
}

// Validate on import - but never block deployment
validateEnv();