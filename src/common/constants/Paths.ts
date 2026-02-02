import jetPaths from 'jet-paths';

export const Paths = {
  _: '/api',
  Youtube: {
    _: '/youtube',
    Get: '/search/:query',
  },
} as const;

export const JetPaths = jetPaths(Paths);

