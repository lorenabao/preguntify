
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


const checkValidationCode = async (code) => {
    const query = `select * from users where validation_code = ?`
    const params = [code]

    const [result] = await performQuery(query, params)

    if (result) {
        const query = `update users set email_validation = true, validation_code = ''`
        await performQuery(query, [])
    } else {
        throw new Error('validation-error')
    }

}

const validate = async (req, res) => {
    const { code } = req.params;

    try {
        checkValidationCode(code)
        res.send('Correctly validated user')
        console.log('Correctly validated user')
    } catch (e) {
        res.status(401).send('User validation error')
    }

}

module.exports = {
    validate
}