"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gemini_1 = __importDefault(require("../llms/gemini"));
const mistral_1 = __importDefault(require("../llms/mistral"));
const fetch_single_thread_1 = __importDefault(require("../utils/fetch_single_thread"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { model } = req.body;
    switch (model.toLowerCase()) {
        case 'gemini 2.0 flash':
            await (0, gemini_1.default)(req, res);
            break;
        case 'mistral':
            await (0, mistral_1.default)(req, res);
            break;
        default:
            res.status(400).json({ error: 'Unsupported model' });
    }
});
router.get('/:id', fetch_single_thread_1.default);
exports.default = router;
