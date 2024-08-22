const service = require("./service");
const utilsChecks = require("../../system/utils/checks");
const redis = require("redis");

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", function () {
  console.log("Connected to Redis ");
});

redisClient.on("error", function (err) {
  console.log("Redis error: " + err);
});

//for one collection data save in redis
const getCountrys = async (req, res) => {
  const countrys = "countrys";

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
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

      return res.status(200).json(result);
    } else {
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
    return res.status(500).json("Internal Server Error");
  }
};

//for  all collection data

// const getCollectionData = async (req, res) => {
//   const collections = [
//     { key: "countrys", fetchFunction: service.getAllCountry },
//     { key: "doctors", fetchFunction: service.getAllDoctors },
//     { key: "patients", fetchFunction: service.getAllPatients },
//   ];

//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     let results = {};

//     for (const collection of collections) {
//       // Try to get the data from Redis cache
//       const cacheData = await redisClient.get(collection.key);

//       if (cacheData) {
//         console.log(`${collection.key}Cache====>>>`, cacheData);
//         const list = JSON.parse(cacheData);

//         if (!utilsChecks.isArray(list) || utilsChecks.isEmptyArray(list)) {
//           results[collection.key] = {
//             message: `No ${collection.key} Found`,
//             detail: [],
//           };
//         } else {
//           results[collection.key] = {
//             message: `${collection.key} List`,
//             detail: list,
//           };
//         }
//       } else {
//         const list = await collection.fetchFunction();
//         console.log(`${collection.key} from DB====>>>`, list);

//         if (!utilsChecks.isArray(list) || utilsChecks.isEmptyArray(list)) {
//           results[collection.key] = {
//             message: `No ${collection.key} Found`,
//             detail: [],
//           };
//         } else {
//           // Save the fetched data to Redis cache
//           await redisClient.setEx(
//             collection.key,
//             parseInt(process.env.NODE_CACHE_STDTTL),
//             JSON.stringify(list)
//           );

//           results[collection.key] = {
//             message: `${collection.key} List`,
//             detail: list,
//           };
//         }
//       }
//     }

//     return res.status(200).json(results);
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return res.status(500).json("Internal Server Error");
//   }
// };

//delete one collection from cache
//take dynamically and add joi n delete all collection
const deleteCountryCache = async (req, res) => {
  // const countrys = "countrys";
  const { key } = req.params;
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Delete the specified key from Redis cache
    const deleted = await redisClient.del(key);

    if (deleted) {
      return res
        .status(200)
        .json({ message: "Countries cache deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "Countries cache not found or already deleted." });
    }
  } catch (error) {
    console.error("Error deleting cache:", error);
    return res.status(500).json("Internal Server Error");
  }
};

//delete all collection from database
// const deleteAllCache = async (req, res) => {
//   const cacheKeys = ["countrys", "doctors", "patients"];

//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     // Delete the specified keys from Redis cache
//     const deletePromises = cacheKeys.map((key) => redisClient.del(key));
//     const deleteResults = await Promise.all(deletePromises);

//     // Check if any of the keys were deleted
//     const deletedCount = deleteResults.reduce(
//       (sum, deleted) => sum + deleted,
//       0
//     );

//     if (deletedCount > 0) {
//       return res.status(200).json({ message: "Cache deleted successfully." });
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No cache found or already deleted." });
//     }
//   } catch (error) {
//     console.error("Error deleting cache:", error);
//     return res.status(500).json("Internal Server Error");
//   }
// };

const clearFieldFromCache = async (req, res) => {
  const cacheKey = "countrys";
  const { key } = req.params; // `key` represents the country name to delete

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const cachedData = await redisClient.get(cacheKey);

    if (!cachedData) {
      return res.status(404).json({ message: "Cache not found" });
    }

    console.log("Cached data:", cachedData);

    const cachedArray = JSON.parse(cachedData);

    console.log("Parsed cached array:", cachedArray);

    // Filter out the country with the specified name
    const updatedArray = cachedArray.filter((country) => country.name !== key);

    if (updatedArray.length === cachedArray.length) {
      return res.status(404).json({
        message: `Country with name '${key}' not found in cache`,
      });
    }

    // Save the updated array back to Redis
    await redisClient.setEx(
      cacheKey,
      parseInt(process.env.NODE_CACHE_STDTTL),
      JSON.stringify(updatedArray)
    );

    return res.status(200).json({
      message: `Country with name '${key}' removed from cache`,
      detail: updatedArray,
    });
  } catch (error) {
    console.error("Error deleting country from cache:", error);
    return res.status(500).json("Internal Server Error");
  }
};

const updateCountryInDBAndCache = async (req, res) => {
  const cacheKey = "countrys";
  const { name, code } = req.body;
  const { _id } = req.params;

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const updatedCountry = await service.updateCountryById(_id, { name, code });

    if (!updatedCountry) {
      return res
        .status(404)
        .json({ message: "Country not found in the database" });
    }

    const updatedCountryList = await service.getAllCountry();

    await redisClient.setEx(
      cacheKey,
      parseInt(process.env.NODE_CACHE_STDTTL),
      JSON.stringify(updatedCountryList)
    );

    return res.status(200).json({
      message: "Country updated successfully in DB and cache",
      detail: updatedCountry,
    });
  } catch (error) {
    console.error("Error updating country and refreshing cache:", error);
    return res.status(500).json("Internal Server Error");
  }
};

// const updateDataInDBAndCache = async (req, res) => {
//   const { collectionName, cacheKey } = req.params;
//   const updateData = req.body;
//   const { _id } = req.params;

//   const collectionMapping = {
//     countries: {
//       updateFunction: service.updateCountryById,
//       getAllFunction: service.getAllCountry,
//     },
//     doctors: {
//       updateFunction: service.updateDoctorById,
//       getAllFunction: service.getAllDoctors,
//     },
//     patients: {
//       updateFunction: service.updatePatientById,
//       getAllFunction: service.getAllPatients,
//     },
//   };

//   const selectedCollection = collectionMapping[collectionName];

//   if (!selectedCollection) {
//     return res.status(400).json({ message: "Invalid collection name" });
//   }

//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     const updatedData = await selectedCollection.updateFunction(
//       _id,
//       updateData
//     );

//     if (!updatedData) {
//       return res
//         .status(404)
//         .json({ message: `${collectionName} not found in the database` });
//     }

//     const updatedList = await selectedCollection.getAllFunction();
//     //if not cache then do not update
//     await redisClient.setEx(
//       cacheKey,
//       parseInt(process.env.NODE_CACHE_STDTTL),
//       JSON.stringify(updatedList)
//     );

//     return res.status(200).json({
//       message: `${collectionName} updated successfully in DB and cache`,
//       detail: updatedData,
//     });
//   } catch (error) {
//     console.error(
//       `Error updating ${collectionName} and refreshing cache:`,
//       error
//     );
//     return res.status(500).json("Internal Server Error");
//   }
// };

module.exports = {
  getCountrys,
  deleteCountryCache,
  clearFieldFromCache,
  updateCountryInDBAndCache,
  // deleteAllCache,
  // getCollectionData,
  // updateDataInDBAndCache,
  // updateDataInDBAndCache,
  // updateAllDataInDBAndCache,
};
