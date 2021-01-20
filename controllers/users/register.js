const bcrypt = require('bcrypt');
const randomstring = require("randomstring");

const { authValidator } = require('../../validators/user')
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


const registerUser = async (email, username, password, validationCode) => {
    const query = `insert into users (
            email, 
            username, 
            password, 
            role, 
            user_registration_date,
            user_updated_date,
            last_connection, 
            email_validation, 
            validation_code,
            registered_user
        ) values (
            ?,
            ?,
            ?,
            'student',
            UTC_TIMESTAMP,
            UTC_TIMESTAMP,
            UTC_TIMESTAMP,
            false,
            ?,
            true
            )`
    const params = [email, username, password, validationCode]

    await performQuery(query, params)

}

const register = async (req, res) => {
    try {
        await authValidator.validateAsync(req.body)

        const { email, username, password } = req.body
        console.log(`New user to register: ${username}, ${email}`)

        const passwordBcrypt = await bcrypt.hash(password, 10);
        console.log('Encrypting password')

        const validationCode = randomstring.generate(40);
        console.log('Generating validation code')


        await registerUser(email, username, passwordBcrypt, validationCode)

        utils.sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/user/validate/${validationCode}`)
        console.log('Sending confimation mail to new user')

    } catch (e) {
        res.status(400).send()
        console.log('Error registration user')
        console.log(e.message)
        return
    }

    res.send('Please, check your email for email validation')
}



module.exports = {
    register
}