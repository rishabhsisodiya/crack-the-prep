/** Evaluated once per build — a cache-buster for files in public/ (GitHub
 *  Pages caches them ~10 min, so a new deploy must change their URLs). */
export const BUILD_ID = Date.now().toString(36);
