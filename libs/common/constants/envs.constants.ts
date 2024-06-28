export const ENVS = {
  database: {
    type: 'DATABASE_TYPE',
    host: 'POSTGRES_HOST',
    port: 'POSTGRES_PORT',
    user: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    name: 'POSTGRES_DB',
    schema: 'POSTGRES_SCHEMA',
  },
  accessToken: {
    secret: 'ACCESS_TOKEN_SECRET',
    expireIn: 'ACCESS_TOKEN_EXPIRATION_TIME',
  },
};
