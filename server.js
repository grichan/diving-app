const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
var cors = require('cors') // cros origin requests

app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())
app.use(cookieParser())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'Set-Cookies, Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  next()
})
app.get('/ping', function (req, res) {
  return res.send('pong')
})

var whitelist = ['http://localhost:3000', 'http://localhost:3001']
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
})

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

app.post('/api/register', function (request, response) {
  console.log(request.body) // your JSON
  let result = registrationAction(request.body)
  response.send(result) // echo the result back
})

function registrationAction (object) {
  console.log(object.usrid)
  if (passwordStrengthValidator(object.pwid) &&
   emailValidator(object.email) &&
    usernameValidator(object.usrid)) {
    console.log('Correct:Format')
    if (createUser(object.usrid, object.email, object.pwid)) {
      console.log('USER:IN-USERS:CREATED')
      if (createUserDb(object.usrid)) { // needs checking
        console.log('USER:DB:CREATED')
        console.log('ALL OK')
        return 'Ok'
      } else {
        console.log('ERROR:USER:DB')
        return 'error:user'
      }
    } else {
      console.log('error:user:creation')
      return 'error:user'
    }
  } else {
    console.log('registration:format:fail')
    return 'error:format'
  }
}

function createUser (username, email, password) {
  // CREATE THE USER
  let nano = require('nano')('http://root:wake13@localhost:5984/_users')
  return nano.insert({ _id: `org.couchdb.user:${username}`,
    name: `${username}`,
    email: `${email}`,
    type: 'user',
    roles: ['ninja', `${username}`],
    password: `${password}`,
    breakfast: ['eggs', 'milk']}
    , (err, response, body) => {
    if (!err) {
      console.log(body)
      console.log('USER CREATED')
      return true
    } else {
      console.log('########################## USER CREATION ERROR ##########################')
      console.log(err)
      console.log('########################## USER CREATION ERROR ##########################')
      return false
    }
  })
}

function createUserDb (username) {
  let nano = require('nano')('http://root:wake13@localhost:5984/')
  // CREATE THE DATABASE
  return nano.db.create(username, function (err, body) {
    if (!err) {
      console.log(`DATABASE ${username} CREATED`)
      return createUserDbSecurityParam(username)
    } else console.log('ERROR:DB:CREATION')
    console.log('########################## USER DB ERROR ##########################')
    console.log(body)
    console.log('########################## USER DB ERROR ##########################')
    return false
  })
}

function createUserDbSecurityParam (username) {
  // SET SECURITY PARAMS - access to db
  let nano = require('nano')(`http://root:wake13@localhost:5984/${username}`)

  if (nano.insert({
    admins: { 'names': [], 'roles': [] },
    members: { 'names': [`${username}`], 'roles': [] }
  }, '_security', function (err, response, body) {
    if (!err) {
      console.log('SECURITY CREATED')
    } else {
      console.log('SECURITY CREATION ERROR')
      console.log('########################## SECURITY DOC ERROR ##########################')
      console.log(body)
      console.log('########################## SECURITY DOC ERROR ##########################')
      return false
    }
  })
  ) {
    if (nano.insert({
      'array': [] }, 'Courses', function (err, response, body) {
      if (!err) {
        console.log('COURSES CREATED')
        return true
      } else {
        console.log('########################## COURSE DOC ERROR ##########################')
        console.log(body)
        console.log('########################## COURSE DOC ERROR ##########################')
        return false
      }
    })
    ) {
      if (nano.insert({
        'array': [] }, 'Products', function (err, response, body) {
        if (!err) {
          console.log('PRODUCTS CREATED')
          return true
        } else {
          console.log('########################## PRODUCTS DOC ERROR ##########################')
          console.log(body)
          console.log('########################## PRODUCTS DOC ERROR ##########################')
          return false
        }
      })) {
        return true
      } else return false
    } else return false
  } else return false
}

/// ////////////////
function passwordStrengthValidator (password) {
  var mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
  return !!mediumRegex.test(password)
}

function emailValidator (email) {
  var emailRagex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return !!emailRagex.test(email)
}

function usernameValidator (username) {
  var ragex = /^[a-z0-9]\w{3}([-_$()+]?[a-z0-9])*$/
  return !!ragex.test(username)
}
/// ///////////////////

function getSeshString (sstring) {
  //  ["AuthSession=bW9vbmNha2U6NUIwQzREQ0Y6j7sKv_jy7rwLCSlvj3z8sNMUCCE; Version=1; Path=/; HttpOnly"]
  let String = sstring.split(/[=;]/)
  console.log('Cutting: ' + String[1])
  session = String[1]
  return String[1]
}

app.post('/api/login', function (request, response, next) {
  console.log('login request')
  console.log(request.body) // your JSON
  let object = request.body
  if (passwordStrengthValidator(object.pwid) &&
  usernameValidator(object.usrid)) {
    console.log('Correct:Format')

    var nano = require('nano')('http://localhost:5984')
    var username = `${object.usrid}`
    var userpass = `${object.pwid}`
    var session = 'no session'
    nano.auth(username, userpass, function (err, body, headers) {
      if (err) {
        if (err.status === 401 | 402) {
          console.log('########################## Username or Password Incorect ##########################')
          console.log(err)
          response.send('########################## Username or Password Incorect ##########################')
        } else {
          console.log('########################## Internal Error ##########################')
          console.log(err)
          console.log('########################## Internal Error END ##########################')
          response.send('Internal Error')
        }
      } else if (headers && headers['set-cookie']) {
        request.app.locals.sesh = JSON.stringify(headers['set-cookie'])
        console.log('u recive')
        console.log(headers['set-cookie'])
        next()
      }
    })
    console.log(session)
  } else console.log('Registration:Format:Fail')
})

app.post('/api/login', function (request, response, next) {
  console.log('Froggy Jump 1 ') // your JSON
  let string = getSeshString(request.app.locals.sesh)
  let options = {
    maxAge: 600, // would expire after 10 minutes
    httpOnly: false, // The cookie only accessible by the web server
    signed: false,
    path: '/' // Indicates if the cookie should be signed
  }
  response.cookie('AuthSession', string, options) // options is optional
  next()
})

app.post('/api/login', function (request, response, next) {
  console.log('Froggy Jump 2') // your JSON
  let string = getSeshString(request.app.locals.sesh)
  console.log(string)
  response.send({'token': string, 'path': '/dashboard'})
})

function loginAction (object) {
  if (passwordStrengthValidator(object.pwid) &&
    usernameValidator(object.usrid)) {
    console.log('Correct:Format')
    loginUser(object)
  } else console.log('Registration:Format:Fail')
}

function loginUser (object) {
  sessionRequest(object.usrid, object.pwid)
}

/// /////////////////////////////////
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))

function draw () {
  console.log('')
  console.log('|\\   \\\\\\\\__     o')
  console.log('| \\_/    o \\    o')
  console.log('> _   (( <_  oo  ')
  console.log('| / \\__+___/      ')
  console.log('|/     |/')
  console.log('')
  console.log('Server running port: 8080')
}

app.listen(process.env.PORT || 8080, () =>
  draw())
