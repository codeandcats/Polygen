export type EnvironmentName = 'development' | 'production' | string;

export function getEnvironmentName(): string {
  return process.env.NODE_ENV || '';
}

export function isDebuggingEnabled(): boolean {
  return getEnvironmentName() === 'development';
}
