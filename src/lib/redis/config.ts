import Redis from 'ioredis'
import EnvVars from '../../common/constants/env';

export let redis: Redis | undefined = undefined;

redis = new Redis({
    port:     EnvVars.RedisPort    ,
    host:     EnvVars.RedisHost    ,
    password: EnvVars.RedisPassword,
    username: EnvVars.RedisUserName,
});

if (!redis) throw new Error('Failed to connect to Redis');

export default redis;