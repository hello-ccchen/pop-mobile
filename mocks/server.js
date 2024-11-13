const {faker} = require('@faker-js/faker');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('mocks/db.json'); // Path to your db.json file
const middlewares = jsonServer.defaults(); // Default middlewares (logger, static, CORS, etc.)
const db = router.db; // This is the lowdb instance

// Use default middlewares (logger, static, CORS, etc.)
server.use(middlewares);

// Explicitly use body parsing middleware in case it's needed
server.use(jsonServer.bodyParser); // This ensures req.body is parsed

// Log incoming requests to inspect the body content
server.use((req, res, next) => {
  console.log('Request body:', req.body); // Log body content to check if it's being parsed
  next();
});

// Use the routes from routes.json
server.use(jsonServer.rewriter(require('./routes.json')));

// Custom route for user login at /api/auth/login
server.post('/api/auth/login', (req, res) => {
  const {username, password} = req.body;

  // Find user in db.json based on username and password
  const user = db.get('users').find({username, password}).value();

  if (user) {
    // If user is found, return the user info and a mock token
    res.json({
      guid: user.guid,
      email: user.email,
      mobile: user.mobile,
      username: user.username,
      token: 'mocked-jwt-token',
      changePassword: user.changePassword,
      twoFactorsAuthentication: user.twoFactorsAuthentication,
      twoFactorsEnabled: user.twoFactorsEnabled,
      profile: user.profile,
    });
  } else {
    // If user not found, return an error
    res.status(401).json({error: 'Invalid username or password'});
  }
});

// Custom route for user registration at /api/customer
server.post('/api/customer', (req, res) => {
  const {username, email, mobile, password, deviceUniqueId, profile} = req.body;

  // Create a new user object
  const newUser = {
    id: Date.now(),
    username,
    email,
    mobile,
    password,
    deviceUniqueId,
    profile,
    guid: faker.string.uuid(), // Simulated GUID
    token: 'mocked-jwt-token', // Simulated token
    changePassword: true,
    twoFactorsAuthentication: true,
    twoFactorsEnabled: true,
  };

  // Save the new user to the "users" collection in db.json
  db.get('users').push(newUser).write();

  // Return the new user data as the response
  res.status(201).json(newUser);
});

// Use the router for handling CRUD operations
server.use(router);

// Start the server
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
