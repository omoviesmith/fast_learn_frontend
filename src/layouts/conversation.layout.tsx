import { useState } from "react";
import { Outlet } from "react-router-dom";
import { isDesktop } from "react-device-detect";

//
import Header from "../components/app/header";
import ConversationList from "../components/views/conversationList";

/**
 *
 */
export default function ConversationLayout() {
  const [isListMinimized, setIsListMinimized] = useState<boolean>(false);

  //
  function onToggle() {
    if (isDesktop) return;
    setIsListMinimized((prev) => !prev);
  }

  //
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!isListMinimized && <ConversationList />}

      <div className="flex w-full flex-col">
        <Header onToggle={onToggle} />

        <div
          id="my-outlet-item"
          className="h-auto w-full flex-grow overflow-y-auto bg-gray-100"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
