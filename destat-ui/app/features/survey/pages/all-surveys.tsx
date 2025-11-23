import { useReadContract } from "wagmi";
import SurveyCard from "../components/survey-card";
import { SURVEY_ABI, SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";

interface SurveyMeta {
  title: string;
  description: string;
  count: number;
  view: number | null;
  image: string | null;
  address: string;
}
[];
export default function ALLSurveys() {
  const [surveys, setSurveys] = useState<SurveyMeta[]>([]);
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

  // onchain은 블록체인 네트워크에서 데이터를 가져올때, offchain은 블록체인 네트워크가 아닌 곳(데이터베이스)
  const offChainLoader = async (): Promise<SurveyMeta[]> => {
    return [
      {
        title: "New Survey",
        description: "Override Test",
        count: 10,
        view: 1600,
        image:
          "https://cdn.inflearn.com/public/files/blogs/88d0e748-499f-4f06-ab76-05bac9b4213d/AI%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%84%82`%E1%85%B3%E1%86%BC%E1%84%89%E1%85%A5%E1%86%BC%E1%84%8C%E1%85%A5%E1%86%A8.jpeg",
        address: "",
      },
    ];
  };

  useEffect(() => {
    const onChainData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const onchainSurveys = await onChainLoader();
      setSurveys(onchainSurveys);
    };
    onChainData();

    const offChainData = async () => {
      const offchainSurveys = await offChainLoader();
      setSurveys(offchainSurveys);
    };
    offChainData();
  }, []);

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
          view={0}
          count={survey.count}
          image={
            "https://cdn.inflearn.com/public/files/blogs/88d0e748-499f-4f06-ab76-05bac9b4213d/AI%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%84%82`%E1%85%B3%E1%86%BC%E1%84%89%E1%85%A5%E1%86%BC%E1%84%8C%E1%85%A5%E1%86%A8.jpeg"
          }
          address={survey.address}
        />
      ))}
    </div>
  );
}
