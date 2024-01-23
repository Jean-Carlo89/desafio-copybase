"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCSV = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
function processCSV(file_path) {
    const json_array = [];
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(`${path_1.default.join(file_path)}`)
            .pipe((0, csv_parser_1.default)({
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim(),
        }))
            .on("data", (data) => {
            const mappedData = {
                quantidade_cobranca: String(data["quantidade cobranças"]),
                dias_cobranca: String(data["cobrada a cada X dias"]),
                data_inicio: String(data["data início"]),
                status: String(data.status),
                data_status: String(data["data status"]),
                data_cancelamento: data["data cancelamento"] ? String(data["data cancelamento"]) : "",
                valor: String(data.valor),
                proximo_ciclo: String(data["próximo ciclo"]),
                id_assinante: String(data["ID assinante"]),
            };
            json_array.push(mappedData);
        })
            .on("end", () => {
            console.log("Completed");
            console.log("Items parsed : ", json_array.length);
            resolve(json_array);
        })
            .on("error", reject);
    });
}
exports.processCSV = processCSV;
