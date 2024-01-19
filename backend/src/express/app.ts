import cors from "cors";
import multer from "multer";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { processCSV } from "../helpers/csv";
import { caclulateChurnTax, calculateMonthlyChurnTax, calculate_active_and_churn_users, reformatarDadosPorAno, user_data } from "../helpers/churn";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Add a unique suffix to prevent overwriting files with the same name
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // Set the file name
  },
});

const upload = multer({ storage: storage });

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],

    methods: ["GET", "POST", "DELETE", "PUT", "HEAD", "PATCH", "OPTIONS"],

    maxAge: 864000,

    allowedHeaders: ["Content-Type", "Authorization"],

    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "20mb" }));

app.use(express.text());

app.use(express.urlencoded({ extended: true }));

app.post("/api/upload", upload.single("file"), async function (req, res) {
  const fileName = req.file.filename;

  console.log(fileName);
  const filePath = path.join(__dirname, "../../uploads", fileName);

  console.log(filePath);

  const array_json = await processCSV(filePath);

  //console.log(array_json);

  const churn_tax = await calculateMonthlyChurnTax(array_json as user_data[]);

  //console.log("here");

  // console.log(churn_tax);
  return res.send(churn_tax);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
