const jwt = require('jsonwebtoken');

const { postAnswer } = require('../../validators/answer')

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

const getUser = async(id) => {
    const query = `select * from users where id = ?`
    const params = [id]

    const [result] = await performQuery(query, params)
    return result
}

const createAnswer = async (id, id_question, body, file) => {
    const query = `INSERT INTO answers
    (id_user, id_question, answer_body, answer_file, answer_publish_date)
    VALUES
    (?, ?, ?, ?, UTC_TIMESTAMP)`
    const params = [id, id_question, body, file]

    await performQuery(query, params)
}


const answer = async (req, res) => {
    const { authorization } = req.headers;
    const { id_question } = req.params;
    const { body, file } = req.body

    try {
        await postAnswer.validateAsync(req.body)
        
        const decodedToken = jwt.verify(authorization, process.env.SECRET);

        const user = await getUser(decodedToken.id)
        
        await createAnswer(user.id, id_question, body, file)

    } catch (e) {
        let statusCode = 400;
        if (e.message === 'database-error') {
            statusCode = 500
        }
        res.status(statusCode).send(e.message)
        return
    }

    res.send('Your answer is posted')
    console.log('New answer posted')
}

module.exports = {
    answer
}