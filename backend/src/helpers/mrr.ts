import csv from "csv-parser";

import fs from "fs";
import path from "path";

type user_data = {
  quantidade_cobrancas: string;
  dias_por_cada_cobranca: string;
  data_inicio: string;
  status: string;
  data_status: string;
  data_cancelamento: string;
  valor: string;
  proximo_ciclo: string;
  id_assinante: string;
};

const fake_json_array = [
  {
    quantidade_cobranca: "1",
    dias_cobranca: "365",
    data_inicio: "2/1/22 7:52",
    status: "Ativa",
    data_status: "2/13/22 6:33",
    data_cancelamento: "",
    valor: "4750,35",
    proximo_ciclo: "14/02/2023",
    id_assinante: "user_10",
  },
  {
    quantidade_cobranca: "1",
    dias_cobranca: "30",
    data_inicio: "5/8/22 23:17",
    status: "Cancelada",
    data_status: "6/14/22 9:36",
    data_cancelamento: "6/14/22 9:36",
    valor: "367,6",
    proximo_ciclo: "6/8/2022",
    id_assinante: "user_100",
  },
  {
    quantidade_cobranca: "1",
    dias_cobranca: "30",
    data_inicio: "2/6/22 17:48",
    status: "Cancelada",
    data_status: "3/15/22 9:44",
    data_cancelamento: "3/15/22 9:44",
    valor: "131,4",
    proximo_ciclo: "3/9/2022",
    id_assinante: "user_1001",
  },
  {
    quantidade_cobranca: "1",
    dias_cobranca: "365",
    data_inicio: "10/11/22 12:14",
    status: "Ativa",
    data_status: "10/11/22 12:14",
    data_cancelamento: "",
    valor: "5437,39",
    proximo_ciclo: "11/10/2023",
    id_assinante: "user_1004",
  },
  {
    quantidade_cobranca: "7",
    dias_cobranca: "30",
    data_inicio: "7/16/23 21:36",
    status: "Ativa",
    data_status: "11/16/23 9:55",
    data_cancelamento: "",
    valor: "481,2",
    proximo_ciclo: "12/17/2024",
    id_assinante: "user_1006",
  },
];

const json_array: user_data[] = [];
//fs.createReadStream("src/helpers/example.csv")
fs.createReadStream(`${path.join(__dirname, "./example.csv")}`)
  .pipe(
    csv({
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim(),
    })
  )
  .on("data", (data) => {
    const mappedData = {
      quantidade: data["quantidade cobranças"],
      dias_cobranca: data["cobrada a cada X dias"],
      data_inicio: toDate(data["data início"]),
      status: data.status,
      data_status: data["data status"],
      data_cancelamento: data["data cancelamento"] || "",
      valor: data.valor,
      proximo_ciclo: data["próximo ciclo"],
      id_assinante: data["ID assinante"],
    };
    json_array.push(mappedData as any);
  })
  .on("end", () => {
    console.log("Completed");
  });

export function test_parse() {
  // console.log(json_array);
}

export function toDate(string) {
  // console.log(string);
  const [datePart, timePart] = string.split(" ");

  let [month, day, year] = datePart.split("/");

  year = new Date(string).getFullYear();
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");

  const formattedString = `${year}-${month}-${day} ${timePart}`;

  // console.log(formattedString);
  return new Date(formattedString);
}

//** Testing new format function */

const format_date = (dateObj) => {
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${month}/${year}`;
};

export function calculate_mrr() {
  const mrr_by_year_and_month = {};

  fake_json_array.forEach((subscription) => {
    if (subscription.status === "Ativa") {
      const date = new Date(subscription.data_inicio);
      let month = date.getMonth();
      let year = date.getFullYear();

      let valor = parseFloat(subscription.valor.replace(",", "."));
      let months_charged = parseInt(subscription.quantidade_cobranca);
      let monthly_value = valor;

      switch (parseInt(subscription.dias_cobranca)) {
        case 365:
        case 360:
          monthly_value /= 12;
          months_charged = 12;
          break;
        case 30:
          break;
        default:
          break;
      }

      for (let i = 0; i < months_charged; i++) {
        if (!mrr_by_year_and_month[year]) {
          mrr_by_year_and_month[year] = {};
        }

        const month_key = String(month + 1).padStart(2, "0");

        if (!mrr_by_year_and_month[year][month_key]) {
          mrr_by_year_and_month[year][month_key] = 0;
        }

        mrr_by_year_and_month[year][month_key] += monthly_value;

        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }
    }
  });

  return Object.keys(mrr_by_year_and_month).map((year) => {
    return { year: year, months: mrr_by_year_and_month[year] };
  });
}

(() => {
  const res = calculate_mrr();

  console.log(res);
})();

const data = `quantidade cobranças,cobrada a cada X dias,data início,status,data status,data cancelamento,valor,próximo ciclo,ID assinante
1,365,2/1/22 7:52,Ativa,2/13/22 6:33,,"4750,35",14/02/2023,user_10
1,30,5/8/22 23:17,Cancelada,6/14/22 9:36,6/14/22 9:36,"367,6",6/8/2022,user_100
1,30,2/6/22 17:48,Cancelada,3/15/22 9:44,3/15/22 9:44,"131,4",3/9/2022,user_1001
1,365,10/11/22 12:14,Ativa,10/11/22 12:14,,"5437,39",11/10/2023,user_1004
2,30,10/16/23 21:36,Ativa,11/16/23 9:55,,"481,2",12/17/2024,user_1006
1,365,2/2/22 11:18,Ativa,2/2/22 11:18,,"5773,13",03/02/2023,user_101
2,30,10/11/22 14:38,Ativa,11/11/22 9:45,,"473,91",12/12/2022,user_1019`;
