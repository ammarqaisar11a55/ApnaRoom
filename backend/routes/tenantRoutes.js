const express = require('express');
const { getTenants, createTenant, updateTenant, removeTenant } = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { hostelIdRequest, tenantRequest, tenantUpdateRequest } = require('../validators/ownerDashboardSchemas');

const router = express.Router();

router.use(protect, authorize('owner'));
router.route('/').get(getTenants).post(validate(tenantRequest), createTenant);
router.route('/:id')
  .put(validate(tenantUpdateRequest), updateTenant)
  .delete(validate(hostelIdRequest), removeTenant);

module.exports = router;
