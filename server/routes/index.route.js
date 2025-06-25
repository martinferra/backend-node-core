const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sharedConfigRoutes = require('./shared-config.route');
const registrationReq = require('../routes/registration-req.route');
const productFamilyRoutes = require('./product-family.route');
const costCenterRoutes = require('./cost-center.route');
const express = require('express');
const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/sharedconfig', sharedConfigRoutes);
router.use('/registrationreq', registrationReq);
router.use('/productfamily', productFamilyRoutes);
router.use('/costcenter', costCenterRoutes);

module.exports = router;
