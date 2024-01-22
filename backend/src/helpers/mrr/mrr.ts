import { user_data } from "../churn";

export function calculate_mrr(array: user_data[]) {
  let items_considered = 0;
  const mrr_by_year_and_month = {};

  array.forEach((subscription) => {
    // if (subscription.status === "Ativa") {
    if (subscription.status && parseInt(subscription.quantidade_cobranca) !== 0) {
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
      items_considered++;
      // }
    }
  });

  console.log("items considered for mrr: ", items_considered);
  return Object.keys(mrr_by_year_and_month).map((year) => {
    return { year: year, months: mrr_by_year_and_month[year] };
  });
}
