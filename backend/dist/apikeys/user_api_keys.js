"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const uuid_1 = require("uuid");
const get_keys = async (req, res) => {
    const apiKeyData = {
        id: (0, uuid_1.v4)(),
        provider: req.body.provider,
        apiKey: req.body.apiKey,
        model: req.body.model,
        isDefault: req.body.isDefault,
        createdAt: new Date(),
    };
    const isEntered = await db_1.db.insert(schema_1.apiConfigs).values(apiKeyData);
    console.log(isEntered);
};
exports.default = get_keys;
