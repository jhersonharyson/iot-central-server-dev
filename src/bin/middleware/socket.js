export default (io) => {
    return (req, res, next) => {
        req.io = io;

        return next();
    };
};
