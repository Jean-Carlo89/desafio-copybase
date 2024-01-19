import dayjs from "dayjs";
function parseDate(dateString) {
  if (!dateString) return null;
  //   const [month, day, year, time] = dateString.split(/[/ ]/);
  //   return new Date(`${year}-${month}-${day}T${time}`);
  return new Date(dateString);
}

//Função para converter a data no formato "M/D/YY H:mm" em um objeto Date
// function parseDate(dateString) {
//   const [date, time] = dateString.split(" ");
//   const [month, day, year] = date.split("/");
//   const [hours, minutes] = time.split(":");
//   return new Date(`20${year}`, month - 1, day, hours, minutes);
// }

export type user_data = {
  quantidade_cobranca: string;
  dias_cobranca: string;
  data_inicio: string;
  status: string;
  data_status: string;
  data_cancelamento: string;
  valor: string;
  proximo_ciclo: string;
  id_assinante: string;
};

function format_data_to_month_year(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${mes}/${ano}`;
}

function add_months(data, meses) {
  const copiaData = new Date(data);
  copiaData.setMonth(copiaData.getMonth() + meses);
  return copiaData;
}

export function calculate_active_and_churn_users(subs) {
  const active_users_by_month = {};
  const churn_by_month = {};

  subs.forEach((sub) => {
    const start_date = new Date(sub.data_inicio);
    const charge_quantity = parseInt(sub.quantidade_cobranca);
    const days_between_charges = parseInt(sub.dias_cobranca);
    const month_oncrement = days_between_charges >= 360 ? 12 : 1;

    //*Active users
    for (let i = 0; i < charge_quantity * month_oncrement; i++) {
      const active_month = format_data_to_month_year(add_months(start_date, i));
      active_users_by_month[active_month] = (active_users_by_month[active_month] || 0) + 1;
    }

    //*  churn users
    if (sub.status === "Cancelada") {
      const days_between_charges = parseInt(sub.dias_cobranca);
      const charge_quantity = parseInt(sub.quantidade_cobranca);
      const is_annual_subscription = days_between_charges >= 360;
      let churn_month;

      if (is_annual_subscription) {
        // * consider churn after the 12 month period for anual subs
        churn_month = format_data_to_month_year(add_months(new Date(sub.data_inicio), 12 * charge_quantity));
      } else if (sub.data_cancelamento) {
        //* monhtly subs
        const cancel_date = new Date(sub.data_cancelamento);
        churn_month = charge_quantity > 1 ? format_data_to_month_year(add_months(cancel_date, 1)) : format_data_to_month_year(cancel_date);
      }

      if (churn_month) {
        churn_by_month[churn_month] = (churn_by_month[churn_month] || 0) + 1;
      }
    }
  });

  return { usuariosAtivosPorMes: active_users_by_month, churnPorMes: churn_by_month };
}

export function caclulateChurnTax(dadosAtivos, dadosChurn) {
  dadosChurn.forEach((anoChurn) => {
    const year = anoChurn.year;
    const churn_months = anoChurn.months;

    Object.keys(churn_months).forEach((mes) => {
      const previous_month = mes === "01" ? "12" : (parseInt(mes) - 1).toString().padStart(2, "0");
      const previous_year = mes === "01" ? (parseInt(year) - 1).toString() : year;

      // * year fo corresponding activ data
      const active_year = dadosAtivos.find((d) => d.year === (mes === "01" ? previous_year : year));
      const active_users_previous_month = active_year ? active_year.months[previous_month] || 0 : 0;

      // * churn tax
      churn_months[mes] = active_users_previous_month > 0 ? (churn_months[mes] / active_users_previous_month) * 100 : 0;
    });
  });

  return dadosChurn;
}

export function reformatarDadosPorAno(dados) {
  const dadosAgrupadosPorAno = {};

  for (const mesAno in dados) {
    const [mes, ano] = mesAno.split("/");
    if (!dadosAgrupadosPorAno[ano]) {
      dadosAgrupadosPorAno[ano] = { year: ano, months: {} };
    }
    dadosAgrupadosPorAno[ano].months[mes] = dados[mesAno];
  }

  return Object.keys(dadosAgrupadosPorAno).map((ano) => dadosAgrupadosPorAno[ano]);
}

const fake_json_array = [
  //   {
  //     quantidade_cobranca: "1",
  //     dias_cobranca: "365",
  //     data_inicio: "3/1/22 7:52",
  //     status: "Cancelada",
  //     data_status: "2/13/22 6:33",
  //     data_cancelamento: "",
  //     valor: "4750,35",
  //     proximo_ciclo: "14/02/2023",
  //     id_assinante: "user_10",
  //   },

  {
    quantidade_cobranca: "2",
    dias_cobranca: "30",
    data_inicio: "10/11/23 12:14",
    status: "Ativa",
    data_status: "10/11/22 12:14",
    data_cancelamento: "",
    valor: "5437,39",
    proximo_ciclo: "11/10/2023",
    id_assinante: "user_1004",
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

  //   {
  //     quantidade_cobranca: "1",
  //     dias_cobranca: "365",
  //     data_inicio: "7/1/23 7:52",
  //     status: "Ativa",
  //     data_status: "2/13/22 6:33",
  //     data_cancelamento: "",
  //     valor: "4750,35",
  //     proximo_ciclo: "14/02/2023",
  //     id_assinante: "user_10",
  //   },
  //   {
  //     quantidade_cobranca: "1",
  //     dias_cobranca: "30",
  //     data_inicio: "5/8/22 23:17",
  //     status: "Cancelada",
  //     data_status: "6/14/22 9:36",
  //     data_cancelamento: "6/14/22 9:36",
  //     valor: "367,6",
  //     proximo_ciclo: "6/8/2022",
  //     id_assinante: "user_100",
  //   },
  //   {
  //     quantidade_cobranca: "7",
  //     dias_cobranca: "30",
  //     data_inicio: "7/16/23 21:36",
  //     status: "Ativa",
  //     data_status: "11/16/23 9:55",
  //     data_cancelamento: "",
  //     valor: "481,2",
  //     proximo_ciclo: "12/17/2024",
  //     id_assinante: "user_1006",
  //   },
];

// (() => {
//   const res = calculate_active_and_churn_users(fake_json_array);

//   console.log(res);

//   const active = reformatarDadosPorAno(res.usuariosAtivosPorMes);
//   const churn = reformatarDadosPorAno(res.churnPorMes);

//   console.log("Usuários Ativos por Ano:", active);
//   console.log("Churn por Ano:", churn);

//   const taxaChurnCalculada = caclulateChurnTax(active, churn);

//   console.log("Taxa de Churn (Array):", taxaChurnCalculada);
// })();

export function calculateMonthlyChurnTax(array: user_data[]) {
  const res = calculate_active_and_churn_users(fake_json_array);

  const active = reformatarDadosPorAno(res.usuariosAtivosPorMes);
  const churn = reformatarDadosPorAno(res.churnPorMes);

  const churn_tax = caclulateChurnTax(active, churn);

  console.log(churn_tax);
  return churn_tax;
}

calculateMonthlyChurnTax(fake_json_array);
