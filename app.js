//1:03:06
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')//middlewear template engine
const morgan = require('morgan')//when there is a request toa page it shows in the console
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

//Load config 
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()
//Logging:since we only want to run morgan in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars - templating engine
//**CHANGE Add the word .engine after exphbs

app.engine('.hbs', exphbs.engine(
    { defaultLayout: 'main',
      extname: '.hbs'}
      ))
app.set('view engine', '.hbs');

//Session middleware
app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder 
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )