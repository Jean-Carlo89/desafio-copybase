import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { user_data } from "./churn";

export function processCSV(file_path: string): Promise<user_data[]> {
  const json_array = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(`${path.join(file_path)}`)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim(),
          mapValues: ({ value }) => value.trim(),
        })
      )
      .on("data", (data) => {
        const mappedData: user_data = {
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
