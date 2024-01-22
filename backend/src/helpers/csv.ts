import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { user_data } from "./churn";

export function processCSV(file_path: string) {
  const json_array = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(`${path.join(file_path)}`)
      // fs.createReadStream(`${path.join(__dirname, "./example.csv")}`)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ value }) => value.trim(),
        })
      )
      .on("data", (data) => {
        const mappedData: user_data = {
          quantidade_cobranca: data["quantidade cobranças"],
          dias_cobranca: data["cobrada a cada X dias"],
          data_inicio: data["data início"],
          status: data.status,
          data_status: data["data status"],
          data_cancelamento: data["data cancelamento"] || "",
          valor: data.valor,
          proximo_ciclo: data["próximo ciclo"],
          id_assinante: data["ID assinante"],
        };
        json_array.push(mappedData);
      })
      .on("end", () => {
        console.log("Completed");
        console.log("Items parsed : ", json_array.length);
        //  console.log(json_array);
        resolve(json_array);
      })
      .on("error", reject);
  });
}

// async function test() {
//   try {
//     const processedData = await processCSV();

//     console.log(processedData);
//   } catch (error) {
//     console.error("Erro ao processar o arquivo CSV:", error);
//   }
// }
