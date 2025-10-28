import { SendIcon, UserIcon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import MessageBubble from "../components/message-bubble";

interface questions {
  question: string;
  options: string[];
}
const questions: questions[] = [
  {
    question: "HTTP와 HTTPS의 주요 차이점은 무엇인가?",
    options: ["보안성", "속도", "포트 번호", "데이터 형식"],
  },
  {
    question: "OSI 7계층 중에서 전송 계층에 해당하는 프로토콜은?",
    options: ["TCP", "IP", "HTTP", "DNS"],
  },
  {
    question: "JavaScript에서 변수를 선언할 때 블록 스코프를 가지는 키워드는?",
    options: ["let", "var", "const", "function"],
  },
  {
    question: "React에서 상태(state)를 관리하기 위한 기본 Hook은?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
  },
  {
    question: "데이터베이스에서 중복을 최소화하기 위한 과정은?",
    options: ["정규화", "비정규화", "트랜잭션", "인덱싱"],
  },
  {
    question: "TCP의 3-way handshake 과정에서 첫 번째 단계는?",
    options: ["SYN", "SYN-ACK", "ACK", "FIN"],
  },
  {
    question: "CSS에서 요소의 위치를 절대좌표로 지정할 때 사용하는 속성은?",
    options: [
      "position: absolute",
      "position: fixed",
      "position: relative",
      "position: static",
    ],
  },
  {
    question: "Git에서 새로운 브랜치를 생성하는 명령어는?",
    options: [
      "git branch <name>",
      "git checkout <name>",
      "git merge <name>",
      "git init",
    ],
  },
  {
    question: "Python에서 리스트의 길이를 구하는 함수는?",
    options: ["len()", "size()", "count()", "length()"],
  },
  {
    question: "C 언어에서 포인터를 선언할 때 사용하는 기호는?",
    options: ["*", "&", "#", "%"],
  },
];
export default function Survey() {
  return (
    <div className="grid grid-cols-3">
      <Card className="col-span-2 w-screen gap-3">
        <CardHeader className="font-extrabold text-3xl">
          <CardTitle>Sample Survey</CardTitle>
          <CardDescription>
            This is a smaple survey. Let's join to get Rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto h-[70vh]">
          <h1 className="font-semibold text-xl pb-4">Survey Progress</h1>
          <div className="gap-5 grid grid-cols-2">
            {questions.map((q, i) => (
              <div className="flex flex-col ">
                <h1 className="font-bold">{q.question}</h1>
                <div className="flex flex-col pl-2 gap-1">
                  {q.options.map((o, j) => (
                    <div className="flex flex-row justify-center items-center relative">
                      <div className="left-2 absolute text-xs font-semibold">
                        {o}
                      </div>
                      <div className="w-full bg-gray-200 h-5 rounded-full">
                        <div className="bg-blue-400 w-7 h-5 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 flex flex-c">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 overflow-y-auto h-[70vh]">
          {Array.from({ length: 20 }).map((_, i) => (
            <MessageBubble sender={i % 2 == 0} />
          ))}
        </CardContent>
        <CardFooter className="w-full">
          <Form className="w-full flex flex-row items-center relative">
            <input
              type="text"
              placeholder="type a message.."
              className="bolder-1 w-full h-8 rounded-2xl px-2 text-xs"
            />
            <Button className="flex flex-row justify-center items-center w-6 h-6 absolute right-2">
              <SendIcon />
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
