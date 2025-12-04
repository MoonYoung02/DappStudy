import { useReadContract } from "wagmi";
import SurveyCard from "../components/survey-card";
import { SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";
import { supabase } from "~/postgress/supaclient";

interface SurveyMeta {
  title: string;
  description: string;
  count: number;
  view: number | null;
  image: string | null;
  address: string;
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { data, error } = await supabase
    .from("all_survey_overview")
    .select("*");
  if (!error) {
    return data.map((s) => {
      return {
        title: s.title!,
        description: s.description!,
        view: s.view,
        count: s.count!,
        image: s.image,
        address: s.id!,
      };
    });
  } else {
    return [];
  }
};

export default function ALLSurveys({ loaderData }: Route.ComponentProps) {
  const [surveys, setSurveys] = useState<SurveyMeta[]>(loaderData);

  const onChainLoader = async () => {
    const client = createPublicClient({
      chain: hardhat,
      transport: http(),
    });
    const surveyFactoryContract = getContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      client,
    });
    const surveys = await surveyFactoryContract.read.getSurveys();
    const surveyMetadata = await Promise.all(
      surveys.map(async (surveyAddress) => {
        const surveyContact = getContract({
          address: surveyAddress,
          abi: SURVEY_ABI,
          client,
        });
        const title = await surveyContact.read.title();
        const description = await surveyContact.read.description();
        const answers = await surveyContact.read.getAnswers();
        return {
          title,
          description,
          count: answers.length,
          view: null,
          image: null,
          address: surveyAddress,
        };
      })
    );
    return surveyMetadata;
  };

  // useEffect(() => {
  //   const onChainData = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     const onchainSurveys = await onChainLoader();
  //     setSurveys(onchainSurveys);
  //   };
  //   onChainData();
  // }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-extrabold">Live Survey</h1>
        <span className="font-light">Join the surveys!!</span>
      </div>
      {surveys.map((survey) => (
        <SurveyCard
          title={survey.title}
          description={survey.description}
          view={survey.view!}
          count={survey.count}
          image={survey.image!}
          address={survey.address}
        />
      ))}
    </div>
  );
}
