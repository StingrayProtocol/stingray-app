import { Fund } from "@/type";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useGetPositionValue from "@/application/query/use-get-position-value";

const TradePieChart = ({ fund }: { fund?: Fund }) => {
  const account = useCurrentAccount();
  const randomId = useMemo(() => Math.random().toString(36).substring(7), []);
  const { data: positionValue } = useGetPositionValue({
    fundId: fund?.object_id,
  });
  useEffect(() => {
    if (!fund || !account || !positionValue) return;
    const chartDom = document.querySelector(
      `#trade${fund?.object_id}${randomId}`
    ) as HTMLCanvasElement;
    if (!chartDom) {
      return;
    }

    const chartData = [
      {
        data: [
          positionValue?.percent.sui,
          positionValue?.percent.trading,
          positionValue?.percent.farming,
        ],
        labels: ["Sui", "Trading", "Farming"],
        backgroundColor: [
          "rgb(120, 0, 200)",
          "rgb(100, 0, 180)",
          "rgb(80, 0, 200)",
        ],
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
        onClick: (e, element) => {
          const index = element[0]?.index;
          if (index === 1) {
            document
              .querySelector("#FundAllocationHolding")
              ?.scrollIntoView({ behavior: "smooth" });
          }
          if (index === 2) {
            document
              .querySelector("#FundAllocationHolding")
              ?.scrollIntoView({ behavior: "smooth" });
          }
        },
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
              if (value > 0.01) {
                return `${
                  context?.chart?.data?.labels?.[context.dataIndex]
                }: ${value.toFixed(2)}%`;
              } else {
                return "";
              }
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
  }, [fund, account, positionValue]);
  return (
    <canvas
      style={{
        cursor: "pointer",
      }}
      id={`trade${fund?.object_id}${randomId}`}
    />
  );
};

export default TradePieChart;
