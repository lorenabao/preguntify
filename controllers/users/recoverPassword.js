const bcrypt = require('bcrypt');
const randomstring = require("randomstring");

const { getConnection } = require("../../db");
const utils = require('../../utils/utils')


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

const recoverUserPassword = async(recoverCode, email) => {
    const query = `update users set validation_code = ?, user_updated_date = UTC_TIMESTAMP where email = ?`
    const params = [recoverCode, email]

    await performQuery(query, params)
}

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await getUser(email)
        if (!user) {
            res.status(401).send('User not found')
            return
        }

        const recoverCode = randomstring.generate(40);

        await recoverUserPassword(recoverCode, email)

        utils.sendRecoverMail(email, recoverCode)
        console.log('Sending validation code to recover password')

    } catch (error) {
        res.status(401).send('Reset password error')
        return
    }

    res.send('Recover password. Please check your email')
}

module.exports = {
    recoverPassword
}