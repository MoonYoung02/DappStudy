import { network } from "hardhat";
import { expect } from "chai";
import { ECDH, sign } from "crypto";
import { ethers } from "ethers";

interface Question {
    question: string;
    options: string[];
}

describe("Survey init", () => {
    const title = "막무가내 설문조사라면";
    const description =
        "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
    const questions: Question[] = [
        {
            question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
            options: [
                "구글폼 운영자",
                "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
                "상관없음",
            ],
        },
    ];


    const getSurveyContractAndEthers = async (survey: {
        title: string;
        description: string;
        targetNumber: number;
        questions: Question[];
    }) => {
        const { ethers } = await network.connect();
        const cSurvey = await ethers.deployContract("Survey", [
            survey.title,
            survey.description,
            survey.targetNumber,
            survey.questions,
        ],
            { value: ethers.parseEther("3") } // 초기 value값 3eth로 설정
        );
        return { ethers, cSurvey };
    };


    describe("Deployment", () => {
        it("should store survey info correctly", async () => {
            const { cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 3, // 응답자수를 3으로 설정
                questions,
            });

            expect(await cSurvey.title()).to.equal(title);
            //console.log(await cSurvey.title());
            expect(await cSurvey.description()).to.equal(description);
            //console.log(await cSurvey.description())
            expect(await cSurvey.targetNumber()).to.equal(3);
            //console.log(await cSurvey.targetNumber())
        });

        it("should calculate rewardAmount correctly", async () => {

            const { cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 3,
                questions,
            });
            const reward = await cSurvey.rewardAmount();
            //console.log(reward);
            // 초기 value = 3eth이니 reward = value / targetNumber에 따라 1eth를 기대
            expect(reward).to.equal(ethers.parseEther("1"));
        });
    });


    describe("Questions and Answers", () => {
        it("should return questions correctly", async () => {
            const { cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 2,
                questions,
            });

            const qs = await cSurvey.getQuestions();
            expect(qs.length).to.equal(1);
            expect(qs[0].question).to.equal(questions[0].question);
            expect(qs[0].options.length).to.equal(questions[0].options.length);

            for (let i = 0; i < qs[0].options.length; i++) {
                expect(qs[0].options[i]).to.equal(questions[0].options[i]);
            }
        });

        it("should allow valid answer submission", async () => {
            const { ethers, cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 2,
                questions,
            });
            const signers = await ethers.getSigners();
            const signer = signers[1];

            await cSurvey.connect(signer).submitAnswer({
                respondent: signer.address,
                answers: [0], // 0번째 질문에 0번째 option을 선택
            });

            const as = await cSurvey.getAnswers();
            expect(as.length).to.equal(1); // 응답의 갯수 1을 기대
            expect(as[0].respondent).to.equal(signer.address);
            expect(as[0].answers.length).to.equal(1);
            expect(as[0].answers[0]).to.equal(0);// 0번째 질문의 응답 = 0을 기대
        });

        it("should revert if answer length mismatch", async () => {
            const { ethers, cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 2,
                questions,
            });
            const signers = await ethers.getSigners();
            const signer = signers[1];

            await expect(
                cSurvey.connect(signer).submitAnswer({
                    respondent: signer.address,
                    answers: [0, 1], // 질문은 1개인데 답이 2개면 revert
                })
            ).to.be.revertedWith("Mismatched answers length");
        });

        it("should revert if target reached", async () => {
            const { ethers, cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 2, // 목표 응답자 수를 2명까지
                questions,
            });
            const sgienrs = await ethers.getSigners();
            const sginer1 = sgienrs[1];
            const sginer2 = sgienrs[2];
            const sginer3 = sgienrs[3];

            await cSurvey.connect(sginer1).submitAnswer({ respondent: sginer1.address, answers: [0] });
            await cSurvey.connect(sginer2).submitAnswer({ respondent: sginer2.address, answers: [2] });
            // 응답 2번을 했으니 이후에 오는 응답에는 revert를 기대

            await expect(
                cSurvey.connect(sginer3).submitAnswer({ respondent: sginer3.address, answers: [1] })
            ).to.be.revertedWith("This survey has been ended");
        });
    });


    describe("Rewards", () => {
        it("should pay correct reward to respondent", async () => {
            const { ethers, cSurvey } = await getSurveyContractAndEthers({
                title,
                description,
                targetNumber: 3,
                questions,
            });
            // 3eth / 3 = 1eth
            expect(await cSurvey.rewardAmount()).to.equal(ethers.parseEther("1"));
            const signers = await ethers.getSigners();
            const signer1 = signers[1];
            const signer1_before_bal = await ethers.provider.getBalance(signer1.address);
            const tx = await
                cSurvey.connect(signer1).submitAnswer({
                    respondent: signer1.address,
                    answers: [2],
                });
            const receipt = await tx.wait();
            const signer_after_bal = await ethers.provider.getBalance(signer1.address);
            const gasCost = receipt?.gasUsed * receipt?.gasPrice;
            //console.log(gasCost)
            const diff = signer_after_bal - signer1_before_bal;
            //console.log(diff); // gas비를 제외한 약 0.99eth를 전송 받음
            expect(diff + gasCost).to.equal(ethers.parseEther("1")); // signer1에게 전송된 eth값 = diff + gasCost이 1eth이길 기대
            expect(await ethers.provider.getBalance(cSurvey.getAddress())).to.equal(ethers.parseEther("2")); // 1eth를 전송했으니 2eth가 남아있길 기대
        });
    });
});