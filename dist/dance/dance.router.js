"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.danceRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const dance_service_1 = require("./dance.service");
exports.danceRouter = (0, express_1.Router)();
exports.danceRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dances = yield (0, dance_service_1.getDances)();
        res.send(dances);
    }
    catch (error) {
        handleError(res, error);
    }
}));
exports.danceRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = zod_1.z.number().parse(Number(req.params.id));
        const dance = yield (0, dance_service_1.getDance)(id);
        if (!dance)
            return res.sendStatus(404);
        res.send(dance);
    }
    catch (error) {
        handleError(res, error);
    }
}));
exports.danceRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.headers.authorization !== 'Bearer 51721') return res.sendStatus(401)
    try {
        const newDance = yield (0, dance_service_1.createDance)(req.body);
        res.status(201).send(newDance);
    }
    catch (error) {
        handleError(res, error);
    }
}));
exports.danceRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.headers.authorization !== 'Bearer 51721') return res.sendStatus(401)
    try {
        const id = zod_1.z.number().parse(Number(req.params.id));
        const updatedDance = yield (0, dance_service_1.updateDance)(id, req.body);
        res.send(updatedDance);
    }
    catch (error) {
        handleError(res, error);
    }
}));
const handleError = (res, error) => {
    if (error instanceof zod_1.ZodError) {
        return res.status(400).send(error.message);
    }
    else if (error instanceof Error) {
        return res.status(500).send(error.message);
    }
    else {
        return res.sendStatus(500);
    }
};
