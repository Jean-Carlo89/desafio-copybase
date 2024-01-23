"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMonthlyChurnTax = void 0;
function parseDate(dateString) {
    if (!dateString)
        return null;
    //   const [month, day, year, time] = dateString.split(/[/ ]/);
    //   return new Date(`${year}-${month}-${day}T${time}`);
    return new Date(dateString);
}
function format_data_to_month_year(data) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${mes}/${ano}`;
}
function calculate_users_churn_rate(subs) {
    const userStatusPerMonth = {};
    const churnRates = {};
    let total = 0;
    subs.forEach((sub) => {
        const userId = sub.id_assinante;
        const startDate = new Date(sub.data_inicio);
        const endDate = sub.status === "Ativa" || sub.status === "Atrasada" ? new Date() : new Date(sub.data_cancelamento);
        const startMonthYear = format_data_to_month_year(startDate);
        const endMonthYear = format_data_to_month_year(endDate);
        if (isNaN(startDate.getTime())) {
            console.log(`Invalid start date: ${sub.data_inicio}`);
        }
        if (isNaN(endDate.getTime())) {
            console.log(`Invalid end date: ${sub.data_cancelamento}`);
        }
        userStatusPerMonth[startMonthYear] = userStatusPerMonth[startMonthYear] || { active: new Set(), churned: new Set() };
        userStatusPerMonth[startMonthYear].active.add(userId);
        if (sub.status !== "Ativa" && sub.status !== "Atrasada") {
            userStatusPerMonth[endMonthYear] = userStatusPerMonth[endMonthYear] || { active: new Set(), churned: new Set() };
            userStatusPerMonth[endMonthYear].churned.add(userId);
        }
        total++;
    });
    let cumulativeActive = new Set();
    Object.keys(userStatusPerMonth)
        .sort()
        .forEach((monthYear) => {
        const { active, churned } = userStatusPerMonth[monthYear];
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
function calculateMonthlyChurnTax(array) {
    return __awaiter(this, void 0, void 0, function* () {
        const churn_tax = calculate_users_churn_rate(array);
        // const churn_tax = [];
        return churn_tax;
    });
}
exports.calculateMonthlyChurnTax = calculateMonthlyChurnTax;
