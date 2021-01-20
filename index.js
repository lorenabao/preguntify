require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')

// Users functions
const {register} = require('./controllers/users/register')
const {validate} = require('./controllers/users/validate')
const {login} = require('./controllers/users/login')
const {logout} = require('./controllers/users/logout')
const {updateUserPassword} = require('./controllers/users/updateUserPassword')
const {recoverPassword} = require('./controllers/users/recoverPassword')
const {resetPassword} = require('./controllers/users/resetPassword')
const {editProfile} = require('./controllers/users/editProfile')
const {deleteAccount} = require('./controllers/users/deleteAccount')
const {publicProfiles} = require('./controllers/users/publicProfiles')
const {ownerProfile} = require('./controllers/users/ownerProfile')
const {userProfile} = require('./controllers/users/userProfile')

// Content endpoints
const {userQuestion} = require('./controllers/content/userQuestion')
const {updateQuestion} = require('./controllers/content/updateQuestion')
const {questionList} = require('./controllers/content/questionList')
const {answer} = require('./controllers/content/answer')



// Middlewares
const {
    isAdmin,
    isAuthenticated,
    isExpert,
    isSameUser
} = require('./middlewares/auth')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 1. Users endpoints
app.post('/user', register)
app.get('/user/validate/:code', validate)
app.post('/user/login', login)
app.post('/user/:id/logout', isAuthenticated, isSameUser, logout)
app.put('/user/:id/password', isAuthenticated, isSameUser, updateUserPassword)
app.post('/user/recover-password', recoverPassword)
app.put('/user/password/reset', resetPassword)
app.put('/user/:id', isAuthenticated, isSameUser, editProfile)
app.post("/user/:id/delete-account", isAuthenticated, isSameUser, deleteAccount)
app.get('/users', isAuthenticated, publicProfiles)
app.get('/user/profile/:id', isAuthenticated, isSameUser, ownerProfile)
app.get('/user/:id', isAuthenticated, userProfile)

// 2. Content endpoints

// 2.1 Post a question
app.post('/:id/question', isAuthenticated, isSameUser, userQuestion)
// 2.2 Edit question
app.put('/:id/question', isAuthenticated, isSameUser, updateQuestion)
// 2.3 Get a list of questions with username and languahge params
app.get('/questions', questionList)
// 2.4 Post a answer
app.post('/question/:id_question', isAuthenticated, (isExpert || isSameUser), answer)

app.listen(process.env.PORT)
