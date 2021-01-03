export const IS_DEV_MODE = ['development', 'dev'].includes(process.env.NODE_ENV)

export const BASE_REQUEST_URL = IS_DEV_MODE ? '//127.0.0.1' : process.env.BASE_REQUEST_URL