import { UserIcon } from "lucide-react";

export default function MessageBubble({ sender }): { sender: boolean } {
  return (
    <div className="">
      {sender ? (
        <div className="flex flex-row items-center justify-end gap-1 ">
          <div className="flex flex-col justify-center items-end w-[70%]">
            <h1 className="font-extrabold text-xs">Nickname</h1>
            <span className="text-xs bg-primary/30 px-2 py-1 rounded-3xl">
              This is a sample message
            </span>
          </div>
          <UserIcon />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-1">
          <UserIcon />
          <div className="flex flex-col justify-center">
            <h1 className="font-extrabold text-xs">Nickname</h1>
            <span className="text-xs">This is a sample message</span>
          </div>
        </div>
      )}
    </div>
  );
}
