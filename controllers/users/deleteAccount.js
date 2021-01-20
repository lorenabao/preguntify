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

const deactivateUser = async (id) => {
    const query = `update users set registered_user = false, token = null, user_updated_date = UTC_TIMESTAMP where id = ?`
    const params = [id]

    await performQuery(query, params)
}

const deleteUser = async (id, reason) => {
    const query = `insert into off_users (id_user, reason) values (id_user = ?, reason = ?);`
    const params = [reason, id]

    await performQuery(query, params)
}


const deleteAccount = async (req, res) => {
    const { id } = req.params;
    const { password, reason } = req.body;

    try {
        const [user] = await getUserId(id)
        const passwordIsvalid = await bcrypt.compare(password, user.password)

        if (!passwordIsvalid) {
            res.status(401).send('Your password is not correct')
            return
        }
        await deactivateUser(id)

        await deleteUser(id, reason)


    } catch (error) {
        res.status(401).send('Error deleting account')
        console.log(error.message)
        return
    }

    res.send('Hope to see you soon!')

}

module.exports = {
    deleteAccount
}
