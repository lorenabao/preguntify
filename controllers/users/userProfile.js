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


const getProfile = async (id) => {
    const query = `select email, 
    username,  
    name, 
    surname, 
    role, 
    avatar,
    user_registration_date,
    user_updated_date,
    last_connection, 
    email_validation from users where id = ?`
    const params = [id]

    const result = await performQuery(query, params)
    return result
}


const userProfile = async (req, res) => {
    const { id } = req.params

    try {
        let profile = await getProfile(id)

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
    userProfile
}
