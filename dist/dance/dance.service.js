"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDance = exports.createDance = exports.getDance = exports.getDances = void 0;
const zod_1 = require("zod");
const db_1 = require("../db");
const getDances = () => {
    return db_1.prisma.dance.findMany({
        orderBy: { order: 'asc' },
    });
};
exports.getDances = getDances;
const getDance = (id) => {
    return db_1.prisma.dance.findUnique({ where: { id } });
};
exports.getDance = getDance;
const createDance = (dance) => {
    const data = danceType.parse(dance);
    return db_1.prisma.dance.create({ data });
};
exports.createDance = createDance;
const updateDance = (id, dance) => {
    const data = danceType.parse(dance);
    return db_1.prisma.dance.update({ where: { id }, data });
};
exports.updateDance = updateDance;
const danceType = zod_1.z.object({
    name: zod_1.z.string(),
    artist: zod_1.z.string(),
    stars: zod_1.z.number().min(0).max(5).default(0),
    motionData: zod_1.z.string().optional(),
});
