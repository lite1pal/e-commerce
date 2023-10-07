/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      "m.media-amazon.com",
      "moviesmedia.ign.com",
      "www.crushpixel.com",
      "api.time.com",
      "static.vecteezy.com",
      "media.npr.org",
      "cdn.discordapp.com",
      "static.yakaboo.ua",
      "i.pinimg.com",
    ],
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
