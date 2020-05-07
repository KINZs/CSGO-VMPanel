/* VMP-by-Summer-Soldier
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of VMP-by-Summer-Soldier
*
* VMP-by-Summer-Soldier is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* VMP-by-Summer-Soldier is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* VMP-by-Summer-Soldier. If not, see http://www.gnu.org/licenses/.
*/

"use strict";

var db = require('../db/db_bridge');
const config = require('../config/config.json')
const serverList = config.servers;

/**
 *   vipDataModel Model
 */
var vipDataModel = {

  /**
   * get all the data form the table
   */
  getallServerData: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let finalResult = []

        for (let i = 0; i < serverList.length; i++) {
          let query = db.queryFormat(`SELECT authId,name,expireStamp,created_at FROM ${serverList[i]} WHERE flag = '"0:a"'`);
          let queryRes = await db.query(query);
          if (!queryRes) {
            return reject("No Data Found");
          }
          finalResult.push({ "servername": serverList[i], "type": "VIPs", "data": queryRes })

          query = db.queryFormat(`SELECT authId,name,expireStamp FROM ${serverList[i]} WHERE flag <> '"0:a"'`);
          queryRes = await db.query(query);
          if (!queryRes) {
            return reject("No Data Found");
          }
          finalResult.push({ "servername": serverList[i], "type": "ADMINs", "data": queryRes })
        }

        // console.log("finalResult in getallTableData->", finalResult)

        return resolve(finalResult);
      } catch (error) {
        console.log("error in getallTableData->", error)
        reject(error)
      }
    });
  },

  /**
 * get single server listing
 */
  getsingleServerData: function (server, type) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!server) return reject("Server is not Provided");
        if (!type) return reject("User type is not Provided");

        let query
        if (type === "vip") {
          query = db.queryFormat(`SELECT * FROM ${server} WHERE flag = '"0:a"'`);
        } else if (type === "admin") {
          query = db.queryFormat(`SELECT * FROM ${server} WHERE flag <> '"0:a"'`);
        }

        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in getsingleServerData->", error)
        reject(error)
      }
    });
  },

  /**
   * insert new vip
   */
  insertVIPData: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {
        // validation
        if (!dataObj.secKey) return reject("Unauth Access, Key Missing");
        if (dataObj.server.length == 0) return reject("Operation Fail!, No Server was selected");

        let currentDateTime = new Date()
        for (let i = 0; i < dataObj.server.length; i++) {
          const query = db.queryFormat(`INSERT INTO ${dataObj.server[i]} (authId, flag, name, created_at, expireStamp) VALUES (?, ?, ?, ?, ?)`, [dataObj.steamId, dataObj.flag, dataObj.name, currentDateTime, dataObj.day]);
          const queryRes = await db.query(query);
          if (!queryRes) {
            return reject("error in insertion");
          }
        }
        return resolve(true);
      } catch (error) {
        console.log("error in insertVIPData->", error)
        reject(error)
      }
    });
  },

  /**
  * update old vip
  */
  updateVIPData: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {
        // validation
        if (!dataObj.secKey) return reject("Unauth Access, Key Missing");
        if (dataObj.server.length == 0) return reject("Operation Fail!, No Server was selected");

        for (let i = 0; i < dataObj.server.length; i++) {
          const query = db.queryFormat(`UPDATE ${dataObj.server[i]} SET expireStamp = expireStamp+${dataObj.day} WHERE authId=?`, [dataObj.steamId]);
          const queryRes = await db.query(query);
          if (!queryRes) {
            return reject("error in update");
          }
        }
        return resolve(true);
      } catch (error) {
        console.log("error in updateVIPData->", error)
        reject(error)
      }
    });
  },

  /**
  * delete old vip
  */
  deleteOldVip: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let currentEpoc = Math.floor(Date.now() / 1000)

        for (let i = 0; i < serverList.length; i++) {
          let query = db.queryFormat(`DELETE FROM ${serverList[i]} where expireStamp < ${currentEpoc} AND flag = '"0:a"' `);
          let queryRes = await db.query(query);
          if (!queryRes) {
            return reject("Error in delete");
          }
        }
        return resolve(true);

      } catch (error) {
        console.log("error in updateVIPData->", error)
        reject(error)
      }
    });
  },


  /**
* delete vip by admin
*/
  deleteVipByAdmin: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        if (!dataObj.secKey) return reject("Unauth Access, Key Missing");

        let query = db.queryFormat(`DELETE FROM ${dataObj.tableName} where authId = ? `, [dataObj.primaryKey]);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("Error in delete");
        }
        return resolve(true);
      } catch (error) {
        console.log("error in deleteVipByAdmin->", error)
        reject(error)
      }
    });
  }

}

module.exports = vipDataModel;