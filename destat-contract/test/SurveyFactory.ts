
import {expect} from "chai"
import {network} from "hardhat"
import {ethers} from "ethers"

interface Question {
    question: string;
    options: string[];
}

const title = "막무가내 설문조사"; const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 계시한자만 볼 수 있습니다.";
const questions: Question[] = [
    {
        question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
        options: [
            "구글폼 운영자","탈중앙화된 블록체인(관리주체 없으며 모든 데이터 공개)", "상관없음",
        ],
    },
];
describe("SurveyFactory Contract", () => {
  let factory:any, owner, respondent1, respondent2;

  beforeEach(async () => {
    const { ethers } = await network.connect();
    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    // TODO: check min_pool_amount and min_reward_amount
    expect(await factory.min_pool_amount()).equal(ethers.parseEther("50")); 
    expect(await factory.min_reward_amount()).equal(ethers.parseEther("0.1"));
    });


  it("should create a new survey when valid values are provided", async () => {
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const value = ethers.parseEther("50");
    const targetNumber = 100; // 설문조사 인원 수 
    // 100ETH / 100 = 1Eth 
    let surveys = await factory.getSurveys();

    // 아직 설문 조사를 만들지 않았으니 0을 기대함
    expect(surveys.length).equal(0);
    
    // TODO: check event SurveyCreated emitted
    await expect(
      factory.createSurvey(
        { title, description, targetNumber, questions },
        { value }
      )
    ).to.emit(factory, "SurveyCreated");


    // TODO: check surveys array length increased
    surveys = await factory.getSurveys();
    expect(surveys.length).equal(1); // 설문조사 생성 후 설문 조사의 개수가 1이어야함

    // 설문 조사를 하나 더 생성 후, 설문 조사 개수가 2개가 되는지 확인
    await factory.createSurvey(
      {title, description, targetNumber, questions},
      {value}
    );
    surveys = await factory.getSurveys();
    expect(surveys.length).equal(2);
  });

  it("should revert if pool amount is too small", async () => {
    // TODO: expect revert when msg.value < min_pool_amount
    // min_pool_amount 미만인 경우
    await expect(
        factory.createSurvey(
        {
            title,
            description,
            targetNumber: 100,
            questions,
        },
        { value: ethers.parseEther("50") - 1n } // 50 ETH - 1 wei
        )
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount

    // 1인당 보상 < min_reward_amount
    await expect(
        factory.createSurvey(
        {
            title,
            description,
            targetNumber: 1000, // 50/1000 = 0.05 ETH < 0.1 ETH
            questions,
        },
        { value: ethers.parseEther("50") }
        )
    ).to.be.revertedWith("Insufficient reward amount");

  });

  it("should store created surveys and return them from getSurveys", async () => {
    // TODO: create multiple surveys and check getSurveys output
    await factory.createSurvey(
      {title, description, targetNumber:50, questions},
      {value: ethers.parseEther("50")}
    );

    await factory.createSurvey(
      {title: title+"1", description, targetNumber: 200, questions},
      {value: ethers.parseEther("50")}
    );

    const surveys = await factory.getSurveys();
    expect(surveys.length).equal(2);
  });
});