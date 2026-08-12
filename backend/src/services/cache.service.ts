import NodeCache from 'node-cache';
import { env } from '../config/env';

const cache = new NodeCache({ stdTTL: env.cacheTtlSeconds, checkperiod: 120 });

export function buildCacheKey(namespace: string, value: string): string {
  return `${namespace}:${value.trim().toLowerCase()}`;
}

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}
