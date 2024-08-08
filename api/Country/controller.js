const service = require("./service");
const utilsChecks = require("../../system/utils/checks");
const redis = require("redis");

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", function () {
  console.log("Connected to Redis qwe");
});

redisClient.on("error", function (err) {
  console.log("Redis error: " + err);
});

redisClient.connect();

const getCountrys = async (req, res) => {
  const countrys = "countrys";

  try {
    // Try to get the data from Redis cache
    const countrysCache = await redisClient.get(countrys);

    if (countrysCache) {
      console.log("countrysCache====>>>", countrysCache);
      const list = JSON.parse(countrysCache);

      if (!utilsChecks.isArray(list) || utilsChecks.isEmptyArray(list)) {
        return res.status(404).json("No countries Found");
      }

      const result = {
        message: "Countries List",
        detail: list,
      };

      // No need to close Redis client here
      return res.status(200).json(result);
    } else {
      // If cache is empty, fetch from the database
      const list = await service.getAllCountry();
      console.log("countrys from DB====>>>", list);

      if (!utilsChecks.isArray(list) || utilsChecks.isEmptyArray(list)) {
        return res.status(404).json("No countries Found");
      }

      // Save the fetched data to Redis cache
      await redisClient.setEx(
        countrys,
        parseInt(process.env.NODE_CACHE_STDTTL),
        JSON.stringify(list)
      );

      const result = {
        message: "Countries List",
        detail: list,
      };

      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    // Ensure Redis client is closed on error
    return res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  getCountrys,
};
