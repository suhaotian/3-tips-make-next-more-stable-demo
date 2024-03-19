import xior from 'xior';
import dedupeRequestPlugin from 'xior/plugins/dedupe';
import errorCachePlugin from 'xior/plugins/error-cache';
import errorRetryPlugin from 'xior/plugins/error-retry';

export const http = xior.create({
  baseURL: 'http://127.0.0.1:3068/',
});

http.plugins.use(
  errorRetryPlugin({
    retryTimes: 2,
    retryInterval(count) {
      return count * 250;
    },
    onRetry(config, error, count) {
      console.log(`${config?.method} ${config?.url} retry ${count}`);
    },
  })
);
http.plugins.use(errorCachePlugin());
http.plugins.use(dedupeRequestPlugin());
