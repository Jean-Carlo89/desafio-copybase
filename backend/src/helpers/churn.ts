import dayjs from "dayjs";
import { processCSV } from "./csv";
import path from "path";
import { subscribe } from "diagnostics_channel";
function parseDate(dateString) {
  if (!dateString) return null;
  //   const [month, day, year, time] = dateString.split(/[/ ]/);
  //   return new Date(`${year}-${month}-${day}T${time}`);
  return new Date(dateString);
}

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

function calculate_users_churn_rate(subs) {
  console.log(subs);
  const userStatusPerMonth = {};
  const churnRates = {};
  let total = 0;

  subs.forEach((sub) => {
    const userId = sub.id_assinante;
    const startDate = new Date(sub.data_inicio);
    const endDate = sub.status === "Ativa" ? new Date() : new Date(sub.data_cancelamento);
    const startMonthYear = format_data_to_month_year(startDate);
    const endMonthYear = format_data_to_month_year(endDate);

    userStatusPerMonth[startMonthYear] = userStatusPerMonth[startMonthYear] || { active: new Set(), churned: new Set() };
    userStatusPerMonth[startMonthYear].active.add(userId);

    if (sub.status !== "Ativa") {
      userStatusPerMonth[endMonthYear] = userStatusPerMonth[endMonthYear] || { active: new Set(), churned: new Set() };
      userStatusPerMonth[endMonthYear].churned.add(userId);
    }

    total++;
  });

  let cumulativeActive = new Set();
  Object.keys(userStatusPerMonth)
    .sort()
    .forEach((monthYear) => {
      const { active, churned }: { active: Set<unknown>; churned: Set<unknown> } = userStatusPerMonth[monthYear];

      console.log(`${monthYear}`);
      console.log("active : ", active.size);

      console.log("churned: ", churned.size);

      console.log("\n");
      cumulativeActive = new Set([...cumulativeActive, ...active]);

      const churnRate = cumulativeActive.size > 0 ? (churned.size / cumulativeActive.size) * 100 : 0;
      churned.forEach((user) => cumulativeActive.delete(user));
      const [month, year] = monthYear.split("/");
      churnRates[year] = churnRates[year] || { year, months: {} };
      churnRates[year].months[month] = churnRate.toFixed(2);
    });

  const result = Object.values(churnRates);

  return result;
}

export async function calculateMonthlyChurnTax(array: user_data[]) {
  const churn_tax: any[] = calculate_users_churn_rate(array);
  // const churn_tax = [];
  return churn_tax;
}
