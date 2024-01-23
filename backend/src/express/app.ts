import cors from "cors";
import multer from "multer";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { processCSV } from "../helpers/csv";
import { calculateMonthlyChurnTax, user_data } from "../helpers/churn";
import fs from "fs";
import { calculate_mrr } from "../helpers/mrr/mrr";
import { processXLSX } from "../helpers/xlsx";
import { DevError } from "../errors/devError";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "/uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: ["http://localhost:3000", "*", "https://desafio-copybase-front.vercel.app", "http://18.188.156.119:3000"],

    methods: ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"],

    maxAge: 864000,

    allowedHeaders: ["Content-Type", "Authorization"],

    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "20mb" }));

app.use(express.text());

app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  return res.status(200).send("Application on");
});

app.post("/api/upload", upload.single("file"), async function (req, res) {
  try {
    const fileName = req.file.filename;

    const filePath = path.join(__dirname, "/uploads", fileName);

    const fileExtension = path.extname(fileName).toLowerCase();

    //const filePath = path.join(__dirname, "../helpers/", "example.csv");

    let array_json: user_data[];

    if (fileExtension === ".csv") {
      array_json = await processCSV(filePath);
    } else if (fileExtension === ".xlsx") {
      array_json = await processXLSX(filePath);
    } else {
      throw new DevError("Unsupported file type");
    }

    const churn_tax = await calculateMonthlyChurnTax(array_json as user_data[]);
    const mrr = calculate_mrr(array_json as user_data[]);

    const data = { churn_tax: churn_tax, mrr };
    let years = new Set();

    data.churn_tax.forEach((item) => years.add(item.year));
    data.mrr.forEach((item) => years.add(item.year));

    let years_array = Array.from(years).map((year) => parseInt(year as any));
    years_array.sort((a, b) => a - b);

    const return_data = { ...data, years: years_array };

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully.");
      }
    });

    return res.send(return_data);
  } catch (error) {
    if (error instanceof DevError) {
      console.error(error);

      return res.status(400).send(error.message);
    }
    console.log(error);
    res.status(500).send("There was a an error");
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//dev
export { app };
