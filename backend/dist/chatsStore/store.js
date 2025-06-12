"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gemini_1 = __importDefault(require("../llms/gemini"));
const mistral_1 = __importDefault(require("../llms/mistral"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    const { model } = req.body;
    switch (model.toLowerCase()) {
        case 'gemini 2.0 flash':
            (0, gemini_1.default)(req, res);
        case 'mistral':
            (0, mistral_1.default)(req, res);
    }
});
exports.default = router;
