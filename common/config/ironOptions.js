export const ironOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'web3-auth',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
    },
}