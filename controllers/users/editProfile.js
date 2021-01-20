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


const updateProfile = async(id, name, surname, birth_date, avatar) => {
    const query = `
    update users set name = ?, 
    surname = ?, 
    birth_date = ?, 
    avatar = ?, 
    user_updated_date = UTC_TIMESTAMP 
    where id = ?`
    const params = [name, surname, birth_date, avatar, id]

    const result = await performQuery(query, params)
    return result
    
}


const editProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, birth_date, avatar } = req.body;

        let userChanges = await updateProfile(id, name, surname, birth_date, avatar)

        res.send(userChanges)

    } catch (error) {
        res.status(401).send('Update profile error')
        console.log(error.message)
        return
    }

}

module.exports = {
    editProfile
}
