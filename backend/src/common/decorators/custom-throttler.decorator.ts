import { Throttle } from '@nestjs/throttler';

export const StrictThrottle = () =>
  Throttle({
    default: {
      ttl: 900000,
      limit: 5,
    },
  });

export const ModerateThrottle = () =>
  Throttle({
    default: {
      ttl: 60000,
      limit: 5,
    },
  });

export const RelaxedThrottle = () =>
  Throttle({
    default: {
      ttl: 60000,
      limit: 20,
    },
  });
