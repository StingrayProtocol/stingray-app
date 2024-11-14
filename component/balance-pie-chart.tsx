import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Fund } from "@/type";
import useGetBalance from "@/application/use-get-balance";
import { SUI_DECIMALS } from "@mysten/sui/utils";

const BalancePieChart = ({ funds }: { funds?: Fund[] }) => {
  const balance = useGetBalance();
  const account = useCurrentAccount();
  useEffect(() => {
    console.log(account?.address);
    console.log(funds);
    if (!account?.address) {
      return;
    }
    if (!funds || !funds.length) {
      return;
    }
    if (isNaN(Number(balance))) {
      return;
    }
    const chartDom = document.querySelector(
      `#balance${account?.address}`
    ) as HTMLCanvasElement;
    if (!chartDom) {
      return;
    }

    const fundInvests = funds?.map((fund) => {
      const selfFundHistory = fund?.fund_history?.filter(
        (history) => history.investor === account?.address
      );
      const total = selfFundHistory?.length
        ? selfFundHistory?.reduce((acc, cur) => acc + Number(cur.amount), 0)
        : 0;
      return total;
    });
    const balanceInSUI = Number(balance) * 10 ** SUI_DECIMALS;
    const total =
      balanceInSUI + fundInvests?.reduce((acc, invest) => acc + invest);
    const chartData = [
      {
        data: [
          balanceInSUI / total,
          ...fundInvests.map((invest) => invest / total),
        ],
        labels: ["Balance", ...funds.map((fund) => fund.name)],
        backgroundColor: [
          "rgb(120, 0, 200)",
          ...funds.map((_, i) => `rgb(${30 + i * 10}, 0, 200)`),
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
              if (value > 0.01) {
                return `${
                  context?.chart?.data?.labels?.[context.dataIndex]
                }: ${(value * 100).toFixed(2)}%`;
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
  }, [funds, account, balance]);
  return <canvas id={`balance${account?.address}`} />;
};

export default BalancePieChart;
