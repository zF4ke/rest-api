import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    // check jwt token

    if (req.headers.authorization) {
        const token = req.headers.authorization

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token'
                })
            }
            req.user = decoded
            next()
        })
    } else {
        return res.status(401).json({
            message: 'No token provided'
        })
    }

}