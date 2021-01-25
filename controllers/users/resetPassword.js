const bcrypt = require('bcrypt');

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

const resetUserPassword = async (recoverCode) => {
    const query = `select * from users where validation_code = ? and email_validation = true`
    const params = [recoverCode]

    const result = await performQuery(query, params)
    return result
}

const updatePassword = async (password, id) => {
    const query = `update users set password = ?, user_updated_date = UTC_TIMESTAMP where id = ? and email_validation = true and registered_user = true`
    const params = [password, id]

    await performQuery(query, params)
}


const resetPassword = async (req, res) => {
    try {
        const { recoverCode, repeatPassword, newPassword } = req.body;

        const [user] = await resetUserPassword(recoverCode)

        if (!user) {
            res.status(401).send('User not found')
            return
        }

        const passwordBcrypt = await bcrypt.hash(newPassword, 10);
        await updatePassword(passwordBcrypt, user.id)

    } catch (error) {
        res.status(401).send('Reset password error')
    }

    res.send('New password updated')
}

module.exports = {
    resetPassword
}