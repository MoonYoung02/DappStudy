// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Question {
  string question;
  string[] options;
}

struct Answer {
  address respondent;
  uint8[] answers;
}

contract Survey {
  string public title;
  string public description;
  uint256 public targetNumber;
  uint256 public rewardAmount;
  Question[] questions; // array의 경우 그 길이가 저장 되기에 slot 하나면 된다
  // Question question; // 하지만, 다음과 같은 Question 타입의 변수는 slot 2개를 요구한다. 당연하게도, Question은 문자열 하나와 문자열 배열을 가지는 struct이기 때문이다.
  Answer[] answers;
  mapping(address => uint) testMap;

  constructor(
    string memory _title,
    string memory _description,
    uint256 _targetNumber,
    Question[] memory _questions
  ) payable {
    title = _title;
    description = _description;
    targetNumber = _targetNumber;
    rewardAmount = msg.value / _targetNumber;
    testMap[0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199] = 1000;

    for (uint i = 0; i < _questions.length; i++) {
      questions.push(
        Question({
          question: _questions[i].question,
          options: _questions[i].options
        })
      );
    }
  }

  function getQuestions() external view returns (Question[] memory) {
    return questions;
  }

  function getAnswers() external view returns (Answer[] memory) {
    return answers;
  }

  function submitAnswer(Answer calldata _answer) external {
    // length validation
    require(
      _answer.answers.length == questions.length,
      "Mismatched answers length"
    );
    require(answers.length < targetNumber, "This survey has been ended");
    answers.push(
      Answer({respondent: _answer.respondent, answers: _answer.answers})
    );
    payable(msg.sender).transfer(rewardAmount);
  }
}
