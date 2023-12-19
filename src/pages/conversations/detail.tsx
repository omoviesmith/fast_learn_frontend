import { useState } from "react";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//
import CoversationChatBot from "../../components/views/conversationChatBot";
import ConversationSummary from "../../components/views/conversationSummary";
import ConversationOptions from "../../components/views/conversationOptions";

//
import Loading from "../../components/reusable/loading";

//
import axiosInstance from "../../utils/axios";

/**
 *
 */
export default function ConverstaionDetailPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  //
  const queryParams = useParams();
  const conversationId = queryParams.id;

  //
  const [activeTab, setActiveTab] = useState<"chatbot" | "summary">("chatbot");

  //
  const clearMutation = useMutation({
    mutationFn: () => {
      if (!conversationId) throw new Error("Conversation ID missing");

      return axiosInstance.post(`/clearhistory/${conversationId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-collection-chat-history", conversationId],
      });
    },
  });

  //
  const deleteMutaiton = useMutation({
    mutationFn: () => {
      if (!conversationId) throw new Error("Conversation ID missing");

      return axiosInstance.delete("delete_document", {
        data: {
          collection_name: conversationId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-document-list"] });
    },
  });

  //
  function clearHistory() {
    clearMutation.mutate();
  }

  //
  function deleteDocument() {
    deleteMutaiton.mutate();
  }

  //
  const isSubmitting = clearMutation.isPending || deleteMutaiton.isPending;

  //
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 w-full flex-shrink-0 justify-between">
        <div
          className={classNames(
            "flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 text-center",
            activeTab === "chatbot"
              ? "bg-primary/50 font-semibold"
              : "bg-gray-200",
          )}
          onClick={() => setActiveTab("chatbot")}
        >
          {t("conversation.chatbot")}
        </div>

        <div
          className={classNames(
            "flex h-full w-full cursor-pointer items-center justify-center border-b border-gray-200 text-center",
            activeTab === "summary"
              ? "bg-primary/50 font-semibold"
              : "bg-gray-200",
          )}
          onClick={() => setActiveTab("summary")}
        >
          {t("conversation.summary")}
        </div>

        <div className="flex items-center justify-center border-b bg-gray-100 px-5">
          <ConversationOptions
            isLoading={isSubmitting}
            onClear={clearHistory}
            onDelete={deleteDocument}
          />
        </div>
      </div>

      {/* Content of different tabs */}
      <div className="flex-grow px-2 pt-2 md:px-5 md:pt-5 lg:px-10">
        {isSubmitting && (
          <div className="my-2 flex w-full items-center justify-center">
            <Loading />
          </div>
        )}

        {!isSubmitting && (
          <>
            {activeTab === "chatbot" && <CoversationChatBot />}
            {activeTab === "summary" && <ConversationSummary />}
          </>
        )}
      </div>
    </div>
  );
}
