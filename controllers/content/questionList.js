const { getConnection } = require("../../db");
const { querysValidator } = require('../../validators/question')


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

const getListOfQuestions = async (username, language) => {
    let query;
    let params;

    if (username && language) {
        query = `select users.username, 
        questions.question_title, 
        questions.question_body, 
        questions.language,
        questions.tag,
        questions.question_publish_date,
        questions.status
        FROM users
        RIGHT JOIN questions
        ON users.id=questions.id_user
        WHERE users.username= ? and questions.language = ?
        `
        params = [username, language]
    } else if (!username && language) {
        query = `select users.username, 
        questions.question_title, 
        questions.question_body, 
        questions.language,
        questions.tag,
        questions.question_publish_date,
        questions.status
        FROM users
        RIGHT JOIN questions
        ON users.id=questions.id_user
        WHERE questions.language = ?
        `
        params = [language]
    } else if (username && !language) {
        query = `select users.username, 
        questions.question_title, 
        questions.question_body, 
        questions.language,
        questions.tag,
        questions.question_publish_date,
        questions.status
        FROM users
        RIGHT JOIN questions
        ON users.id=questions.id_user
        WHERE users.username= ?
        `
        params = [username]       
    } else {
        query = `select users.username, 
        questions.question_title, 
        questions.question_body, 
        questions.language,
        questions.tag,
        questions.question_publish_date,
        questions.status
        FROM users
        RIGHT JOIN questions
        ON users.id=questions.id_user
        `
        params = []
    }

    const result = await performQuery(query, params)
    return result
}

// Problema: tanto si el username o lenguaje proporcionado en el params
// no existe o no coincide con el que existe en la db nos devuelve toda
// la lista de preguntas (entra en el último else) pero debería avisar
// que no existe ningún usuario registrado con ese nombre o que el lenguaje
// tampoco existe en nuestro sistema.

const questionList = async (req, res) => {
    const { username, language } = req.params
    try {
        await querysValidator.validateAsync(req.params)

        let questions = await getListOfQuestions(username, language)

        if (!questions.length) {
            res.status(404).send('No questions')
        } else {
            res.send(questions)
        }
    } catch (e) {
        res.status(500).send('Error: questions doesnt match')
    }
}



module.exports = {
    questionList
}