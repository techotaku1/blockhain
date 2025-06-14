<<<<<<< HEAD
// Puedes definir variables de entorno aquí si las necesitas
// Por ejemplo:
// process.env.MY_ENV_VAR = 'valor';
=======
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Validación de la API key de POAP que debe ser un JWT válido
    NEXT_PUBLIC_POAP_API_KEY: z
      .string()
      .min(1)
      .refine((val) => {
        const parts = val.split('.');
        return parts.length === 3; // Asegura que sea un JWT válido
      }, 'Invalid POAP API key format'),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_POAP_API_KEY: process.env.NEXT_PUBLIC_POAP_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
>>>>>>> 344398032f30454eae7f8cc3dec61b590dac2919
