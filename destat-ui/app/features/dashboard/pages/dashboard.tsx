import TrendCard from "../components/trend-card";
import { TrendChart } from "../components/trend-chart";

const data = [
  { date: "2025-10-01", data: 182 },
  { date: "2025-10-02", data: 183 },
  { date: "2025-10-03", data: 184 },
  { date: "2025-10-04", data: 185 },
  { date: "2025-10-05", data: 186 },
  { date: "2025-10-06", data: 187 },
  { date: "2025-10-07", data: 188 },
  { date: "2025-10-08", data: 189 },
  { date: "2025-10-09", data: 190 },
  { date: "2025-10-10", data: 191 },
  { date: "2025-10-11", data: 192 },
  { date: "2025-10-12", data: 193 },
  { date: "2025-10-13", data: 194 },
  { date: "2025-10-14", data: 195 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-5 mt-10 gap-5 w-full">
        <TrendCard
          title={"Total Visitors"}
          value={"123,123"}
          trendValue={"200000%"}
          trendMessage={"Hot potato"}
          periodMessage={"last 2 month"}
        ></TrendCard>
        <TrendCard
          title={"Linve surveys"}
          value={"123,123"}
          trendValue={"200000%"}
          trendMessage={"Hot potato"}
          periodMessage={"last 2 month"}
        ></TrendCard>
        <TrendCard
          title={"Archived Surveys"}
          value={"123,123"}
          trendValue={"200000%"}
          trendMessage={"Hot potato"}
          periodMessage={"last 2 month"}
        ></TrendCard>
      </div>
      <div className="grid grid-cols-2 mt-5 gap-5 w-full">
        <TrendChart
          title={"Live Surveys"}
          description={"daily live survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        ></TrendChart>
        <TrendChart
          title={"Archive Surveys"}
          description={"daily live survey count"}
          trendMessage={""}
          periodMessage={""}
          chartData={data}
        ></TrendChart>
      </div>
    </div>
  );
}
