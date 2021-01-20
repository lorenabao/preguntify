const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { getConnection } = require("../../db");


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

const getUser = async (email) => {
    const query = `select * from users where email = ?`
    const params = [email]

    const result = await performQuery(query, params)
    return result
}

const userToken = async(token, email) => {
    const query = `update users set token = ? where email = ? and email_validation = true and registered_user = true`
    const params = [token, email]

    await performQuery(query, params)
}

const login = async (req, res) => {
    const { email, password } = req.body
    
    const [user] = await getUser(email)

    if (!user) {
        res.status(401).send('Incorrect user or password')
        return
    }

    const passwordIsvalid = await bcrypt.compare(password, user.password);

    if (!passwordIsvalid) {
        res.status(401).send('Incorrect password or user')
        return
    }

    const tokenPayload = {
        isExpert: user.role === 'expert',
        isAdmin: user.role === 'admin',
        role: user.role,
        email: user.email,
        password: user.password,
        id: user.id
    }

    const token = jwt.sign(tokenPayload, process.env.SECRET, {
        expiresIn: '1d'
    });

    await userToken(token, email)

    res.json({
        token
    })
    console.log('Logged-in user')
}



module.exports = {
    login
}