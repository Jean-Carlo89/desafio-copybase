import xlsx from "xlsx";
import { user_data } from "./churn";
import * as fromExcelDate from "js-excel-date-convert";

function formatDateToString(value) {
  if (!value) return "";

  return String(value); //***** Working because of  { cellDates: true })  option */
}

export function processXLSX(file_path: string): Promise<user_data[]> {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.readFile(file_path, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json_array = xlsx.utils.sheet_to_json(sheet, {
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
    } catch (error) {
      console.error("Error processing XLSX file:", error);
      reject(error);
    }
  });
}
