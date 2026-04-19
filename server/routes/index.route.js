const router = require('express').Router();
const backendCustom = require('@martinferra/backend-custom');

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sharedConfigRoutes = require('./shared-config.route');
const registrationReq = require('../routes/registration-req.route');

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/sharedconfig', sharedConfigRoutes);
router.use('/registrationreq', registrationReq);

backendCustom.getRoutes().forEach(route => {
  router.use(`/${route.name}`, route.module);
});

module.exports = router;
