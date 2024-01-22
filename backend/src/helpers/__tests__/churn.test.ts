import exp from "constants";
import { calculateMonthlyChurnTax, calculate_active_and_churn_users } from "../churn";
const fake_json_array_2 = [
  {
    quantidade_cobranca: "1",
    dias_cobranca: "30",
    data_inicio: "02/22/22 12:14",
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
    status: "Ativa",
    data_status: "",
    data_cancelamento: "",
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

const fake_json_array_1 = [
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
    quantidade_cobranca: "1",
    dias_cobranca: "30",
    data_inicio: "10/11/23 12:14",
    status: "Ativa",
    data_status: "10/11/22 12:14",
    data_cancelamento: "",
    valor: "5437,39",
    proximo_ciclo: "11/10/2023",
    id_assinante: "user_1004",
  },

  //   {
  //     quantidade_cobranca: "1",
  //     dias_cobranca: "30",
  //     data_inicio: "2/6/22 17:48",
  //     status: "Cancelada",
  //     data_status: "3/15/22 9:44",
  //     data_cancelamento: "3/15/22 9:44",
  //     valor: "131,4",
  //     proximo_ciclo: "3/9/2022",
  //     id_assinante: "user_1001",
  //   },

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

describe("Churn tax tests", () => {
  describe("function calculate_active_and_churn_users unit tests", () => {
    // const res = calculate_active_and_churn_users(fake_json_array_1);

    it("calculate_active_and_churn_users with 1 item", () => {
      const arragne = [
        {
          test_data_set: [
            {
              quantidade_cobranca: "1",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
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
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "4",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "5",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "5",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1 },
            churnPorMes: {},
          },
        },
      ];

      for (let i = 0; i < arragne.length; i++) {
        const item = arragne[i];

        expect(calculate_active_and_churn_users(item.test_data_set)).toStrictEqual(item.expected);
      }
    });
    it("calculate_active_and_churn_users with 1 item of annual sub", () => {
      const arragne = [
        {
          test_data_set: [
            {
              quantidade_cobranca: "1",
              dias_cobranca: "360",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1, "03/2024": 1, "04/2024": 1, "05/2024": 1, "06/2024": 1, "07/2024": 1, "08/2024": 1, "09/2024": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "1",
              dias_cobranca: "360",
              data_inicio: "10/11/23 12:14",
              status: "Cancelada",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1, "03/2024": 1, "04/2024": 1, "05/2024": 1, "06/2024": 1, "07/2024": 1, "08/2024": 1, "09/2024": 1 },
            churnPorMes: {},
          },
        },
      ];

      for (let i = 0; i < arragne.length; i++) {
        const item = arragne[i];

        expect(calculate_active_and_churn_users(item.test_data_set)).toStrictEqual(item.expected);
      }
    });

    it("calculate_active_and_churn_users with many items", () => {
      const arragne = [
        {
          test_data_set: [
            {
              quantidade_cobranca: "1",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
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
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "4",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "5",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1 },
            churnPorMes: {},
          },
        },

        {
          test_data_set: [
            {
              quantidade_cobranca: "5",
              dias_cobranca: "30",
              data_inicio: "10/11/23 12:14",
              status: "Ativa",
              data_status: "10/11/22 12:14",
              data_cancelamento: "",
              valor: "5437,39",
              proximo_ciclo: "11/10/2023",
              id_assinante: "user_1004",
            },
          ],

          expected: {
            usuariosAtivosPorMes: { "10/2023": 1, "11/2023": 1, "12/2023": 1, "01/2024": 1, "02/2024": 1 },
            churnPorMes: {},
          },
        },
      ];

      for (let i = 0; i < arragne.length; i++) {
        const item = arragne[i];

        expect(calculate_active_and_churn_users(item.test_data_set)).toStrictEqual(item.expected);
      }
    });
  });

  it("", () => {});
  it("should return churn rate as expected", () => {
    expect(calculateMonthlyChurnTax(fake_json_array_1)).toStrictEqual([{ year: "2022", months: { "03": 100 } }]);
  });

  // it("should return churn rate as expected", () => {
  //     expect(calculateMonthlyChurnTax(fake_json_array_2)).toStrictEqual([{ year: "2022", months: { "03": 100 } }]);
  //   });
});
