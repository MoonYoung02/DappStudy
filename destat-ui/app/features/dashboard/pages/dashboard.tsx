import { supabase } from "~/postgress/supaclient";
import TrendCard from "../components/trend-card";
import { TrendChart } from "../components/trend-chart";
import { DateTime } from "luxon";
import { getNumberData } from "../query";
import { form } from "viem/chains";
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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { data, error } = await supabase.rpc("increment_daily_visitor", {
    day: DateTime.now().startOf("day").toISO({ includeOffset: false }),
  });
  const thisWeekStart = DateTime.now()
    .startOf("week")
    .toISO({ includeOffset: false });
  const thisWeekEnd = DateTime.now().toISO({ includeOffset: false });
  const lastWeekStart = DateTime.now()
    .startOf("week")
    .minus({ week: 1 })
    .toISO({ includeOffset: false });
  const { data: liveSurveyCount } = await supabase
    .from("daily_live_survey")
    .select("count, created_at")
    .order("created_at");
  console.log(liveSurveyCount);

  let formedLivedSurveyCount = [
    {
      date: "",
      data: 0,
    },
  ];
  if (liveSurveyCount) {
    formedLivedSurveyCount = liveSurveyCount?.map((c) => {
      return {
        date: c.created_at,
        data: c.count,
      };
    });
  }

  const numberCard = await getNumberData(
    lastWeekStart,
    thisWeekStart,
    thisWeekEnd
  );
  return {
    ...numberCard,
    formedLivedSurveyCount,
  };
};

export default function Dashboard({ loaderData }): Route.ComponentProps {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-5 mt-10 gap-5 w-full">
        <TrendCard
          title={"Total Visitors"}
          value={loaderData.value}
          trendValue={loaderData.trendValue + "%"}
          trendMessage={loaderData.upAndDown ? "Trending Up" : "Trending Down"}
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
          chartData={loaderData.formedLivedSurveyCount}
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
