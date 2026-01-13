import { vi } from 'vitest';

global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        if (callback) {
          callback({});
        }
        return Promise.resolve({});
      }),
      set: vi.fn((items, callback) => {
        if (callback) {
          callback();
        }
        return Promise.resolve();
      }),
    },
  },
  runtime: {
    sendMessage: vi.fn((message, callback) => {
      if (callback) {
        callback();
      }
    }),
    lastError: null,
  },
};
