import jetPaths from 'jet-paths';

export const Paths = {
  _: '/api',
  Youtube: {
    _: '/youtube',
    Get: '/search/:query',
  },
  Room: {
    _: '/room',
    Post: '/create',
  }
} as const;

export const JetPaths = jetPaths(Paths);

