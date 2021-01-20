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


const getMyProfile = async (id) => {
    const query = `select * from users where id = ?`
    const params = [id]

    const result = await performQuery(query, params)
    return result
}


const ownerProfile = async (req, res) => {
    const { id } = req.params

    try {
        let profile = await getMyProfile(id)

        if (!profile.length) {
            res.status(404).send('User not found')
        } else {
            res.send(profile)
        }
    } catch (e) {
        res.status(500).send('Cannot find user')
    }
}

module.exports = {
    ownerProfile
}
