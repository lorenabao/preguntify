const Joi = require('joi');

const postAnswer = Joi.object({  
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
            )
})


module.exports = {
    postAnswer
}
