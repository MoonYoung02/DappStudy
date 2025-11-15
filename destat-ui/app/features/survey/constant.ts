export const SURVEY_FACTORY = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const SURVEY_FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_min_pool_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_min_reward_amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "SurveyCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "targetNumber",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "string",
                name: "question",
                type: "string",
              },
              {
                internalType: "string[]",
                name: "options",
                type: "string[]",
              },
            ],
            internalType: "struct Question[]",
            name: "questions",
            type: "tuple[]",
          },
        ],
        internalType: "struct SurveyShcema",
        name: "_survey",
        type: "tuple",
      },
    ],
    name: "createSurvey",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getSurveys",
    outputs: [
      {
        internalType: "contract Survey[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "min_pool_amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "min_reward_amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const; //as const 의미 : immutable 이 배열을 불변하게 만들어야 wagmi에서 타입에러를 내놓지 않는다.
