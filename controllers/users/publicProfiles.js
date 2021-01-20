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


const getPublicProfile = async (username, role) => {
    let query;
    let params;

    if (username && role) {
        query = `select name, surname, role, username from users where username = ? and role = ? `
        params = [username, role]
    } else if (!username && role) {
        query = `select name, surname, role, username from users where role = ?`
        params = [role]
    } else if (username && !role) {
        query = `select name, surname, role, username from users where username = ?`
        params = [username]
    } else {
        query = `select name, surname, role, username from users`
        params = []
    }

    const result = await performQuery(query, params)

    return result
}


const publicProfiles = async (req, res) => {
    const { username, role } = req.query

    try {
        let profiles = await getPublicProfile(username, role)

        if (!profiles.length) {
            res.status(404).send('User not found')
        } else {
            res.send(profiles)
        }
    } catch (e) {
        res.status(500).send('Cannot find users')
    }
}

module.exports = {
    publicProfiles
}
