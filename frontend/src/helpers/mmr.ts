import { time } from 'console';
import csv from 'csv-parser';

import fs from 'fs';

type user_data = {
  quantidade: string;
  dias_cobranca: string;
  status: string;
  valor: string;
  data_inicio: string;
};

const json_array: user_data[] = [];
fs.createReadStream('src/helpers/example.csv')
  .pipe(
    csv({
      mapHeaders: ({ header }) => header.trim(),
      mapValues: ({ value }) => value.trim(),
    }),
  )
  .on('data', (data) => {
    const mappedData = {
      quantidade: data['quantidade cobranças'],
      dias_cobranca: data['cobrada a cada X dias'],
      data_inicio: toDate(data['data início']),
      status: data.status,
      data_status: data['data status'],
      data_cancelamento: data['data cancelamento'] || '',
      valor: data.valor,
      proximo_ciclo: data['próximo ciclo'],
      id_assinante: data['ID assinante'],
    };
    json_array.push(mappedData);
  })
  .on('end', () => {
    console.log('Completed');
  });

export function test_parse() {
  console.log(json_array);
}

export function toDate(string) {
  console.log(string);
  const [datePart, timePart] = string.split(' ');

  let [month, day, year] = datePart.split('/');

  year = new Date(string).getFullYear();
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');

  const formattedString = `${year}-${month}-${day} ${timePart}`;

  console.log(formattedString);
  return new Date(formattedString);
}

// const format_date = (dataString) => {
//   const [month, day, year] = dataString.split(' ')[0].split('/');
//   return `${month}/${year}`;
// };

//** Testing new format function */

const format_date = (dateObj) => {
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${month}/${year}`;
};

// export function calculate_monthly_mmr() {
//   const mrr_by_month = {};

//   json_array.forEach((subscription) => {
//     if (subscription.status === 'Ativa') {
//       const start_date = format_date(subscription.data_inicio);
//       mrr_by_month[start_date] = mrr_by_month[start_date] || 0;

//       let valor = parseFloat(subscription.valor.replace(',', '.'));
//       let valorMensal =
//         parseInt(subscription.dias_cobranca) === 365 ? valor / 12 : valor;
//       mrr_by_month[start_date] +=
//         valorMensal * parseInt(subscription.quantidade);
//     }
//   });

//   return mrr_by_month;
// }

export function calculate_monthly_mmr() {
  const mrr_by_year_and_month = {};

  json_array.forEach((subscription) => {
    if (subscription.status === 'Ativa') {
      const date = new Date(subscription.data_inicio);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      if (!mrr_by_year_and_month[year]) {
        mrr_by_year_and_month[year] = {};
      }

      if (!mrr_by_year_and_month[year][month]) {
        mrr_by_year_and_month[year][month] = 0;
      }

      let valor = parseFloat(subscription.valor.replace(',', '.'));
      let valorMensal = valor;

      switch (parseInt(subscription.dias_cobranca)) {
        case 365:
        case 360:
          valorMensal /= 12;
          break;
        case 30:
          break;
        default:
          break;
      }

      mrr_by_year_and_month[year][month] +=
        valorMensal * parseInt(subscription.quantidade);
    }
  });

  return mrr_by_year_and_month;
}

// export function calculate_monthly_mmr() {
//   const mrr_by_year_and_month = {};

//   json_array.forEach((subscription) => {
//     if (subscription.status === 'Ativa') {
//       const [month, year] = format_date(subscription.data_inicio).split('/');

//       // * add year if to aux object in case it still does not exist
//       if (!mrr_by_year_and_month[year]) {
//         mrr_by_year_and_month[year] = {};
//       }

//       //* add month if needed
//       if (!mrr_by_year_and_month[year][month]) {
//         mrr_by_year_and_month[year][month] = 0;
//       }

//       let valor = parseFloat(subscription.valor.replace(',', '.'));
//       let valorMensal =
//         parseInt(subscription.dias_cobranca) === 365 ? valor / 12 : valor;
//       mrr_by_year_and_month[year][month] +=
//         valorMensal * parseInt(subscription.quantidade);
//     }
//   });

//   return mrr_by_year_and_month;
// }

export function caclulate_mmr() {
  let mrr = 0;
  json_array.forEach((subscription) => {
    if (subscription.status === 'Ativa') {
      let valor = parseFloat(subscription.valor.replace(',', '.'));
      let valorMensal =
        parseInt(subscription.dias_cobranca) === 365 ? valor / 12 : valor;
      mrr += valorMensal * parseFloat(subscription.quantidade);
    }
  });
  return mrr;
}

const data = `quantidade cobranças,cobrada a cada X dias,data início,status,data status,data cancelamento,valor,próximo ciclo,ID assinante
1,365,2/1/22 7:52,Ativa,2/13/22 6:33,,"4750,35",14/02/2023,user_10
1,30,5/8/22 23:17,Cancelada,6/14/22 9:36,6/14/22 9:36,"367,6",6/8/2022,user_100
1,30,2/6/22 17:48,Cancelada,3/15/22 9:44,3/15/22 9:44,"131,4",3/9/2022,user_1001
1,365,10/11/22 12:14,Ativa,10/11/22 12:14,,"5437,39",11/10/2023,user_1004
2,30,10/16/23 21:36,Ativa,11/16/23 9:55,,"481,2",12/17/2024,user_1006
1,365,2/2/22 11:18,Ativa,2/2/22 11:18,,"5773,13",03/02/2023,user_101
2,30,10/11/22 14:38,Ativa,11/11/22 9:45,,"473,91",12/12/2022,user_1019`;
