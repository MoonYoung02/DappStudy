import { useState, type FormEvent } from "react";
import { Form } from "react-router";
import { useWriteContract } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { SURVEY_FACTORY, SURVEY_FACTORY_ABI } from "../constant";
import { parseEther } from "viem";

// export const action = async ({ request }: Route.ActionArgs) => {
//   const formData = await request.formData();
//   console.log(formData);
// };

// useState[2, 3, 2] 0번 질문은 옵션이 2개, 1번은 3개 ..
export default function () {
  const [options, setOptions] = useState([1]);
  const [image, setImage] = useState("");
  const { writeContract } = useWriteContract();

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuestion = () => {
    setOptions([...options, 1]);
  };

  const deleteQuestion = () => {
    if (options.length <= 1) return;
    setOptions(options.slice(0, options.length - 1));
  };
  const addOption = (i: number) => {
    console.log("addOption");
    setOptions(options.map((o, j) => (i == j ? o + 1 : o)));
  };

  const deleteOption = (i: number) => {
    console.log("deleteOpt");
    if (options[i] <= 1) return;
    setOptions(options.map((o, j) => (i == j ? o - 1 : o)));
  };
  interface Question {
    question: string;
    options: string[];
  }
  const createSurvey = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const questionsData = formData.getAll("q") as string[];
    const questions = questionsData.map((q, i) => {
      const options = formData.getAll(i.toString()) as string[];
      return {
        question: q,
        options,
      } as const;
    });

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetNumber = formData.get("target") as string;
    const poolSize = formData.get("pool") as string;
    writeContract({
      address: SURVEY_FACTORY,
      abi: SURVEY_FACTORY_ABI,
      functionName: "createSurvey",
      args: [
        {
          title,
          description,
          targetNumber: BigInt(targetNumber),
          questions,
        },
      ],
      value: parseEther(poolSize),
    });
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Survey</CardTitle>
          <CardDescription>
            Build and publish a new survey to collect reliable responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={(e) => createSurvey(e)} encType="multipart/form-data">
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Title</h1>
              <Input type="text" name="title" />
            </label>
            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Description</h1>
              <Input type="text" name="description" />
            </label>

            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Target Number</h1>
              <Input type="text" name="target" />
            </label>

            <label className="flex flex-col mb-4">
              <h1 className="font-bold">Reward Pool Size</h1>
              <Input type="number" name="pool" placeholder="ex) 50(ETH)" />
            </label>
            <h1 className="font-bold mb-2">Questions</h1>
            {options.map((n, i) => (
              <div className="mb-4">
                <Input type="text" placeholder="Question" name="q" />
                <div>
                  {Array.from({ length: n }).map((_, j) => (
                    <div className="flex items-center">
                      {j == n - 1 && j != 0 ? (
                        <Button
                          type="button"
                          onClick={() => deleteOption(i)}
                          className="h-8 w-8 rounded-full mr-1 bg-red-300"
                        >
                          -
                        </Button>
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-1.5"></div>
                      )}
                      <Input
                        type="text"
                        placeholder="Option"
                        name={i.toString()}
                      />
                      {j == n - 1 && (
                        <Button
                          type="button"
                          onClick={() => addOption(i)}
                          className="h-8 w-8 rounded-full ml-1 bg-gray-300"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center items-center mb-4">
              <Button
                type="button"
                onClick={() => deleteQuestion()}
                className="h-8 w-8 rounded-full ml-1 bg-red-300"
              >
                -
              </Button>

              <Button
                type="button"
                onClick={() => addQuestion()}
                className="h-8 w-8 rounded-full ml-1 bg-gray-300"
              >
                +
              </Button>
            </div>
            <h1 className="font-bold mb-2">Upload FIle</h1>
            <Card className="mb-5">
              <CardContent>
                <div className="flex justify-center items-center relative">
                  {image ? (
                    <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                      <img
                        src={image}
                        className="rounded-2xl object-cover w-[300px] h-[300px]"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-[300px] h-[300px] border-2 rounded-2xl">
                      +
                    </div>
                  )}
                  <label className="absolute w-[300px] h-[300px] top-0">
                    <Input
                      type="file"
                      className="hidden"
                      name="image"
                      onChange={uploadFile}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
