const jwt = require('jsonwebtoken');

const { getConnection } = require("../db");


const performQuery = async (query, params) => {
    let connection;
    console.log(query)

    try {
        connection = await getConnection();

        const [result] = await connection.query(query, params)

        return result;
    } catch (e) {
        throw new Error('database-error')
    } finally {
        if (connection) {
            connection.release()
        }
    }
}

const getUserId = async (id) => {
    const query = `select * from users where id = ?`
    const params = [id]

    const [result] = await performQuery(query, params)
    return result
}

const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization, process.env.SECRET);

        const user = await getUserId(decodedToken.id)

        if (!user) {
            throw new Error('token error')
        }

        req.auth = decodedToken;
    } catch (e) {
        res.status(401).send('Not authenticated')
        return
    }

    next();
}

const isAdmin = (req, res, next) => {
    if (!req.auth || !req.auth.isAdmin) {
        res.status(403).send('You do not have admin permission')
        return

    }

    next();
}

const isExpert = (req, res, next) => {
    if (!req.auth || !req.auth.isExpert) {
        res.status(403).send('You do not have expert permission')
        return

    }

    next();
}

const isSameUser = (req, res, next) => {
   
    const { id } = req.params;

    if (parseInt(id) === req.auth.id || req.auth.isAdmin) {
        next()
    } else {
        res.status(403).send('User doesnt match')
        return
    }
}


module.exports = {
    isAdmin,
    isAuthenticated,
    isExpert,
    isSameUser
};