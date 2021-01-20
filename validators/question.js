const Joi = require('joi');

const postQuestion = Joi.object({
    title: Joi.string()
        .min(5)
        .max(100)
        .required()
        .error(
            new Error('Need a title')
        ),
    
    body: Joi.string()
        .min(5)
        .max(100)
        .required()
            .error(
                new Error('Need a body')
            ),

    file: Joi.any()
            .error(
                new Error('File error')
            ),

    language: Joi.any()
        .valid('html', 'css', 'javascript', 'sql')
        .required()
            .error(
                new Error('Choose html, css, javascript or sql')
            ),

    tag: Joi.string()
    .min(3)
        .error(
            new Error('Tag syntax')
        )
})


const querysValidator = Joi.object({
    username: Joi.string()
    .min(5)
    .max(100)
    .optional()
        .error(
            new Error('Username inavalid format')
        ),
    
    language: Joi.string()
    .valid('html', 'css', 'javascript', 'sql')
    .optional()
        .error(
            new Error('Set html, css, javascript or sql')
        )
})


const updatedQuestion = Joi.object({
    title: Joi.string()
        .min(5)
        .max(100)
        .required()
        .error(
            new Error('Need a title')
        ),
    
    body: Joi.string()
        .min(5)
        .max(100)
        .required()
            .error(
                new Error('Need a body')
            ),

    file: Joi.any()
            .error(
                new Error('File error')
            ),

    tag: Joi.string()
    .min(3)
        .error(
            new Error('Tag syntax')
        )
})


module.exports = {
    postQuestion,
    querysValidator,
    updatedQuestion
}
