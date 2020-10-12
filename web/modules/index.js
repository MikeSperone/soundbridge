const userRoutes = require('./users/user.routes');
module.exports = app => app.use('/api/v1/users', userRoutes);
