"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processXLSX = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
function formatDateToString(value) {
    if (!value)
        return "";
    return String(value); //***** Working because of  { cellDates: true })  option */
}
function processXLSX(file_path) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx_1.default.readFile(file_path, { cellDates: true });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json_array = xlsx_1.default.utils.sheet_to_json(sheet, {
                header: 1,
                blankrows: false,
            });
            const mapped_array = json_array.slice(1).map((row) => {
                const data_inicio = formatDateToString(row[2]);
                const data_status = formatDateToString(row[4]);
                const data_cancelamento = row[5] ? formatDateToString(row[5]) : "";
                const proximo_ciclo = formatDateToString(row[7]);
                return {
                    quantidade_cobranca: String(row[0]),
                    dias_cobranca: String(row[1]),
                    data_inicio,
                    status: String(row[3]),
                    data_status,
                    data_cancelamento,
                    valor: String(row[6]),
                    proximo_ciclo,
                    id_assinante: String(row[8]),
                };
            });
            console.log("Completed");
            console.log("Items parsed : ", mapped_array.length);
            resolve(mapped_array);
        }
        catch (error) {
            console.error("Error processing XLSX file:", error);
            reject(error);
        }
    });
}
exports.processXLSX = processXLSX;
