import jetEnv, { num } from 'jet-env';
import { isValueOf } from 'jet-validators';

/******************************************************************************
                                 Constants
******************************************************************************/

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars = jetEnv({
  NodeEnv: isValueOf(NodeEnvs),
  Port: num,
  YoutubeApiKey: String,
  RedisUserName: String,
  RedisPassword: String,
  RedisHost: String,
  RedisPort: num,
  JwtSecret: String,
  RoomExpirationTime: num,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
