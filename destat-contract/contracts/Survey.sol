// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Question {
   string question;
   string[] options; 
}

contract Survey {
    string public title;
    string public description;
    Question[] questions;
    // solidity의 저장 타입, 호출되는 위치는 memory, storage, calldata로 구분할 수 있다. 
    // calldata : 함수를 호출할 때 쓰인다. 이때 calldata를 보낼 때는 storage나 memory와 다르게 값을 변경할 수 없다.  
    // storage : 기본적으로 위와 같은 상태변수들을 storage로 저장된다. string storage title 인데 storage가 생략되어 있는 것이다. 
    // memory : 휘발되는 값이다. storage 변수들은 블록체인 네트워크에 저장되지만 memory 변수는 그렇지 않고 휘발된다.

    // primitive : int, bool, uint 사실 string도 다른 언어에서는 primitive이다. 하지만, string은 가변적이며 블록체인에서는 storage가 가장 중요한 자원이다. 그래서 이를 별도로 다룬다.

    constructor(string memory _title, string memory _description, Question[] memory _questions) { // Data loaction must be "storage" or "memory" for constructor parameter
    // 이때 data loactoin은 primitive를 포함하는 말이 아니다. 때문에 int8타입은 별도로 storage, memory같은 키워드가 필요없다. 이미 크기가 정해졌기 때문이다.
       title = _title;
       description = _description;
    //    questions = _questions; // copying of type struct Questions memory[] memory to storage is not supported in legacy
       // 단순히 이렇게 assign하면 얕은복사로, 현재 메모리에 로드된 _questions 배열의 시작주소만 storage변수인 questions에 저장된다. 이러면, 만약 메모리가 휘발 된 후 이 코드를 동작하면 
       // 다시 그 배열을 찾을 수 없을 것이다. 당연하게도, 그 배열이 이전과 같은 시작주소를 가질 것이라는 보장이 없기 때문이다. 때문에, 깊은 복사가 필요하다.

       for (uint i = 0; i < _questions.length; i ++){
            questions.push(
                Question({
                    question:_questions[i].question,
                    options:_questions[i].options
                    })
            );
            // Question storage q = questions.push();
            // q.question = _questions[i].question;
            // q.options = _questions[i].options;
       }
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }
}
