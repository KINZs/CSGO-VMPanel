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
const vipModel = require("../models/vipModel.js");
const userModel = require("../models/userModel.js");

// -----------------------------------------------------------------------------------------

exports.deleteVipData = async (req, res) => {
  try {
    let result = await deleteVipDataFunc(req.body, req.session.username);
    res.json({
      success: true,
      data: { "res": result, "message": "VIP deleted Successfully" }
    });
  } catch (error) {
    console.log("error in delete vip->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deleteVipDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        console.log("reqBody in delete vip->", reqBody)
        reqBody.primaryKey = '"' + reqBody.primaryKey + '"'
        let deleteRes = await vipModel.deleteVipByAdmin(reqBody)
        if (deleteRes) {
          resolve(deleteRes)
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }

    } catch (error) {
      console.log("error in deleteVipDataFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

// -----------------------------------------------------------------------------------------

exports.deleteVipDataFunc = deleteVipDataFunc;
