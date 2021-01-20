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

const logoutUser = async(id) => {
    const query = `update users set token = null, last_connection = UTC_TIMESTAMP  where id = ?`
    const params = [id]

    await performQuery(query, params)
    
}

const logout = async (req, res) => {
    try {
        const { id } = req.params

        const user = await getUserId(id)

        if (!user) {
            res.status(401).send('User not found')
            return
        }

        await logoutUser(id)
    } catch (error) {
        res.status(401).send('Still logged')
        return
    }

    res.send('Bye. See you soon')
    console.log('Logged-out user')
}


module.exports = {
    logout
}