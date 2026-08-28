export const logger = (req, res, next) => {
    const time = new Date().toISOString();

    console.log(`Got a ${req.method} from ${req.url} at ${time}`);

    next();

}