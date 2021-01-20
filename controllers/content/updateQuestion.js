const { updatedQuestion } = require('../../validators/question')

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

const updateUserQuestion = async (id, title, body, file, tag) => {
    const query = `update questions set 
    question_title = ?, 
    question_body = ?, 
    question_file = ?, 
    tag = ?, 
    question_update_date = UTC_TIMESTAMP 
    where id_user = ?`
    const params = [title, body, file, tag, id]

    await performQuery(query, params)
}


const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { title, body, file, tag } = req.body
    
    try {
        await updatedQuestion.validateAsync(req.body)

        await updateUserQuestion(id, title, body, file, tag)

    } catch (e) {
        let statusCode = 400;
        if (e.message === 'Update error') {
            statusCode = 500
        }
        res.status(statusCode).send(e.message)
        return
    }

    res.send('Modified question')
    console.log('Updated question')
}



module.exports = {
    updateQuestion
}