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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const csv_1 = require("../helpers/csv");
const churn_1 = require("../helpers/churn");
const fs_1 = __importDefault(require("fs"));
const mrr_1 = require("../helpers/mrr/mrr");
const xlsx_1 = require("../helpers/xlsx");
const devError_1 = require("../errors/devError");
const app = (0, express_1.default)();
exports.app = app;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/";
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const extension = path_1.default.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + extension);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "*"],
    methods: ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"],
    maxAge: 864000,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json({ limit: "20mb" }));
app.use(express_1.default.text());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    return res.status(200).send("Application on");
});
app.post("/api/upload", upload.single("file"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = req.file.filename;
            const filePath = path_1.default.join(__dirname, "../../uploads", fileName);
            const fileExtension = path_1.default.extname(fileName).toLowerCase();
            //const filePath = path.join(__dirname, "../helpers/", "example.csv");
            let array_json;
            if (fileExtension === ".csv") {
                array_json = yield (0, csv_1.processCSV)(filePath);
            }
            else if (fileExtension === ".xlsx") {
                array_json = yield (0, xlsx_1.processXLSX)(filePath);
            }
            else {
                throw new devError_1.DevError("Unsupported file type");
            }
            const churn_tax = yield (0, churn_1.calculateMonthlyChurnTax)(array_json);
            const mrr = (0, mrr_1.calculate_mrr)(array_json);
            const data = { churn_tax: churn_tax, mrr };
            let years = new Set();
            data.churn_tax.forEach((item) => years.add(item.year));
            data.mrr.forEach((item) => years.add(item.year));
            let years_array = Array.from(years).map((year) => parseInt(year));
            years_array.sort((a, b) => a - b);
            const return_data = Object.assign(Object.assign({}, data), { years: years_array });
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
                else {
                    console.log("File deleted successfully.");
                }
            });
            return res.send(return_data);
        }
        catch (error) {
            if (error instanceof devError_1.DevError) {
                console.error(error);
                return res.status(400).send(error.message);
            }
            console.log(error);
            res.status(500).send("There was a an error");
        }
    });
});
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
