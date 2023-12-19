import dayjs from "dayjs";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

//
import Loading from "../reusable/loading";

//
import { RiSendPlaneFill } from "react-icons/ri";
import {
  // GoThumbsup,
  // GoThumbsdown,
  GoCopy,
} from "react-icons/go";

//
import axiosInstance from "../../utils/axios";
import { DEFAUL_QUERIES } from "../../utils/constants";
import { getRandomString } from "../../utils/helper";
import copyTextToClipboard from "../../utils/clipboard";

import {
  IApiAskQuestionResponse,
  IApiChatHistoryResponse,
} from "../../types/api.types";

//
const MAX_LENGTH = 2000;

/**
 *
 */
export default function CoversationChatBot() {
  const { t } = useTranslation();
  const queryParams = useParams();

  //
  const [question, setQuestion] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conversation, setConversation] = useState<any[]>([]);

  //
  const messageListRef = useRef<HTMLDivElement>(null);

  // Query to fetch history, called oncea t the beginning or query change
  const { isFetching } = useQuery({
    queryKey: ["get-collection-chat-history", queryParams.id],
    queryFn: async () => {
      const response = await axiosInstance.get<IApiChatHistoryResponse>(
        `/chathistory/${queryParams.id}`,
      );

      //
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newArrayItems: any[] = [];

      //
      for (const item of response.data.chat_history) {
        if (!DEFAUL_QUERIES.includes(item.query.trim())) {
          newArrayItems.push({
            id: Date.now().toString() + getRandomString(5),
            bot: false,
            message: item.query,
          });
        }

        newArrayItems.push({
          id: Date.now().toString() + getRandomString(5),
          bot: true,
          message: item.response,
        });
      }
      setConversation(newArrayItems);

      return newArrayItems;
    },
  });

  // Mutation to ask a new question
  const mutation = useMutation({
    mutationFn: async (qn: string) => {
      // Adding question to local conversation list
      setConversation((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          bot: false,
          message: qn,
          createdAt: Date.now(),
        },
      ]);

      // Clearing the question input field
      setQuestion("");

      // Getting response
      const response = await axiosInstance.post<IApiAskQuestionResponse>(
        "/retriever",
        {
          collection_name: queryParams.id ?? "",
          query: qn,
        },
      );

      // Adding response to the list
      setConversation((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          bot: true,
          message: response.data.answer,
          createdAt: Date.now(),
        },
      ]);
    },
  });

  //
  const isInputDisabled = isFetching || mutation.isPending;

  //
  function handleKeyUpInput(key: string) {
    if (key !== "Enter") return;
    askQuestion();
  }

  //
  function askQuestion() {
    mutation.mutate(question);
  }

  //
  async function copyBotResponse(message: string) {
    await copyTextToClipboard(message);
  }

  // Scrolling to bottom of message list
  useEffect(() => {
    const elementToScroll = document?.getElementById?.("my-outlet-item");

    //
    if (!elementToScroll) return;
    if (!messageListRef.current) return;

    // Scroll to top of reposnse
    // const height =
    //   messageListRef.current.offsetHeight -
    //     (messageListRef.current.lastElementChild?.clientHeight ?? 0) -
    //     10 ?? 0;

    // Scroll to bottom of response
    const height = messageListRef.current.offsetHeight ?? 0;

    //
    setTimeout(() => {
      document
        .getElementById("my-outlet-item")
        ?.scrollTo({ top: height, behavior: "smooth" });
    }, 120);
  }, [conversation]);

  //
  useEffect(() => {
    setConversation([]);
  }, [queryParams.id]);

  //
  return (
    <div className="relative flex h-full flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-5" ref={messageListRef}>
        {conversation.map((conv) => (
          <div key={conv.id}>
            <div
              className={classNames(
                "flex gap-2",
                conv.bot ? "justify-start" : "justify-end",
              )}
            >
              <div
                className={classNames(
                  "mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-primary",
                  { "order-1": !conv.bot },
                )}
              />
              <div className="w-full max-w-xl cursor-default rounded-lg border border-gray-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-md whitespace-pre-line">{conv.message}</p>

                {conv.bot && (
                  <div className="mt-5 flex justify-end gap-3 text-gray-500">
                    <button onClick={() => copyBotResponse(conv.message)}>
                      <GoCopy size={20} />
                    </button>

                    {/* <button>
                      <GoThumbsup size={20} />
                    </button> */}

                    {/* <button>
                      <GoThumbsdown size={20} />
                    </button> */}
                  </div>
                )}
              </div>
            </div>

            {conv.createdAt && (
              <p
                className={classNames(
                  "mt-[6px] text-xs",
                  conv.bot ? "ml-12" : "mr-12 text-right",
                )}
              >
                {dayjs(conv.createdAt).format("hh:mm A")}
              </p>
            )}
          </div>
        ))}

        {isInputDisabled && <Loading />}
      </div>

      <div className="sticky bottom-0 flex w-full gap-3 bg-gray-100 pb-5 pt-3">
        <div className="flex w-full flex-col">
          <input
            type="text"
            value={question}
            disabled={isInputDisabled}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyUp={(e) => handleKeyUpInput(e.key)}
            placeholder={t("conversation.askQuestion")}
            className="h-12 w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed"
          />
          <div
            className={classNames(
              "mr-3 mt-[2px] text-right text-xs font-semibold",
              question.length > MAX_LENGTH ? "text-red-500" : "text-gray-500",
            )}
          >
            <span>
              {question.length} / {MAX_LENGTH}
            </span>
          </div>
        </div>

        <button
          onClick={() => askQuestion()}
          disabled={
            !question.length || question.length > MAX_LENGTH || isInputDisabled
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 p-2 text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <RiSendPlaneFill size={28} className="-ml-[2px] mt-[2px]" />
        </button>
      </div>
    </div>
  );
}
