import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

//
import { CgNotes } from "react-icons/cg";

//
import Loading from "../reusable/loading";

//
import axiosInstance from "../../utils/axios";

//
import type { ISummarizeResponse } from "../../types/api.types";

/**
 *
 */
export default function ConversationSummary() {
  const { t } = useTranslation();

  //
  const [summary, setSummary] = useState<string>();

  //
  const queryParams = useParams();
  const conversationId = queryParams.id;

  //
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post<ISummarizeResponse>(
        "/summarize",
        { collection_name: conversationId },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSummary(data.answer);
    },
  });

  //
  function getSummary() {
    mutation.mutate();
  }

  //
  return (
    <div className="relative flex h-full flex-grow flex-col">
      <div className="flex-grow">
        {mutation.isPending && (
          <div className="my-2 flex w-full items-center justify-center">
            <Loading />
          </div>
        )}

        {!mutation.isPending && summary && (
          <div className="w-full max-w-xl cursor-default rounded-lg border border-gray-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-md whitespace-pre-line">{summary}</p>
          </div>
        )}
      </div>

      <div className="flex w-full items-end justify-end py-2 md:py-5">
        <button
          onClick={() => getSummary()}
          className="flex items-center gap-3 rounded-full bg-gray-900 px-6 py-3 text-sm text-gray-100 shadow transition-all duration-300 hover:scale-[1.03]"
        >
          <CgNotes size={20} className="-ml-[2px] mt-[2px]" />
          <span>{t("conversation.summary")}</span>
        </button>
      </div>
    </div>
  );
}
