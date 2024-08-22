const express = require("express");
const router = express.Router();
const controller = require("./controller.js");
const { celebrate } = require("celebrate");
const schema = require("./schema");

const { authenticate } = require("../../system/middleware/authentication.js");

router.get("/list_of_country", authenticate, controller.getCountrys);

//router.get("/get_all_data", authenticate, controller.getCollectionData);

//full collction delete
router.delete(
  "/delete_immediate_value/:key",
  authenticate,
  celebrate(schema.deleteSchema, schema.options),
  controller.deleteCountryCache
);

//single country value delete
router.delete(
  "/clear_particular_field/:key",
  authenticate,
  celebrate(schema.getAllByParams, schema.options),
  controller.clearFieldFromCache
);

router.put(
  "/update_data/:_id",
  authenticate,
  celebrate(schema.updateSchema, schema.options),
  controller.updateCountryInDBAndCache
);

// router.delete("/delete_all_cache", authenticate, controller.deleteAllCache);

// router.put(
//   "/update/:collectionName/:_id/:cacheKey",
//   authenticate,
//   controller.updateDataInDBAndCache
// );

module.exports = router;
