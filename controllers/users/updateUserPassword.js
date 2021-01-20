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

const getUserId = async (id) => {
    const query = `select * from users where id = ?`
    const params = [id]

    const [result] = await performQuery(query, params)
    return result
}

const updatePassword = async(password, id) => {
    const query = `update users set password = ?, user_updated_date = UTC_TIMESTAMP where id = ? and email_validation = true and registered_user = true`
    const params = [password, id]

    await performQuery(query, params)
}

const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const passwordBcrypt = await bcrypt.hash(newPassword, 10);

        const user = await getUserId(id)

        if (!user) {
            res.status(401).send('User not found')
            return
        }

        const passwordIsvalid = await bcrypt.compare(oldPassword, user.password);
        if (!passwordIsvalid) {
            res.status(401).send('Incorrect password')
            return
        }

        await updatePassword(passwordBcrypt, id)


    } catch (error) {
        res.status(401).send('Password not updated')
        return
    }

    res.send('Updated password')

}

module.exports = {
    updateUserPassword
}