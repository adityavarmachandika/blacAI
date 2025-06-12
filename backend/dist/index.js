"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_api_keys_1 = __importDefault(require("./apikeys/user_api_keys"));
const store_1 = __importDefault(require("./chatsStore/store"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/chat', store_1.default);
app.post('/apikeys', user_api_keys_1.default);
app.listen('3030', (error) => {
    console.log("working on 3030", error);
});
