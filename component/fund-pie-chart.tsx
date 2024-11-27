import { Fund } from "@/type";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const FundPieChart = ({ fund }: { fund?: Fund }) => {
  const account = useCurrentAccount();
  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);
  useEffect(() => {
    const chartDom = document.querySelector(
      `#fund${fund?.object_id}${randomId}`
    ) as HTMLCanvasElement;
    if (!chartDom) {
      return;
    }
    const selfFundHistory = fund?.fund_history?.filter(
      (history) => history.investor === account?.address
    );
    const total = selfFundHistory?.length
      ? selfFundHistory.reduce((acc, cur) => {
          acc =
            cur.action === "Invested"
              ? acc + Number(cur.amount)
              : acc - Number(cur.amount);
          return acc;
        }, 0)
      : 0;
    const limit = fund?.limit_amount;
    const totalPercent = total && limit ? (total / Number(limit)) * 100 : 0;
    const remainingPercent = 100 - totalPercent;

    const chartData = [
      {
        data: [totalPercent, remainingPercent],
        labels: ["Funded", "Remaining"],
        backgroundColor: ["#a101eb", "#8a03da"],
        borderColor: ["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.5)"],
      },
    ];
    Chart.register(ChartDataLabels);
    const chart = new Chart(chartDom, {
      type: "pie",
      data: {
        labels: chartData[0].labels,

        datasets: [
          {
            label: "Fund",
            data: chartData[0].data,
            backgroundColor: chartData[0].backgroundColor,
            borderColor: chartData[0].borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        // onClick: (e, element) => {
        //   const index = element[0]?.index;
        // },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            color: "white",
            formatter: (value, context) => {
              return context.dataIndex === 0 ? `${value.toFixed(2)}%` : "";
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return () => {
      chart.destroy();
    };
  }, [fund, account, randomId]);
  return <canvas id={`fund${fund?.object_id}${randomId}`} />;
};

export default FundPieChart;
