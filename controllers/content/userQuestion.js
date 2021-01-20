const { postQuestion } = require('../../validators/question')

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

const createQuestion = async (id, title, body, file, language, tag) => {
    const query = `INSERT INTO questions
    (id_user, question_title, question_body, question_file, language, tag, question_publish_date, status)
    VALUES
    (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP, 'open')`
    const params = [id, title, body, file, language, tag]

    await performQuery(query, params)
}


const userQuestion = async (req, res) => {
    const { id } = req.params;
    const { title, body, file, language, tag } = req.body
    
    try {
        await postQuestion.validateAsync(req.body)

        await createQuestion(id, title, body, file, language, tag)

    } catch (e) {
        let statusCode = 400;
        if (e.message === 'database-error') {
            statusCode = 500
        }
        res.status(statusCode).send(e.message)
        return
    }

    res.send('Your question is posted')
    console.log('New question posted')
}



module.exports = {
    userQuestion
}