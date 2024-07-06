const isLoggedIn = (req, res, next) => {
    // res.locals?
    req.user ? next() : res.sendStatus(401);
};
export default isLoggedIn;
