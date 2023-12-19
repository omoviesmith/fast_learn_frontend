import classNames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

//
import { BsFillChatDotsFill, BsChatLeftDotsFill } from "react-icons/bs";

//
import axiosInstance from "../../utils/axios";
import { snakeCaseToTitleCase } from "../../utils/helper";

/**
 *
 */
export default function ConversationList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  //
  const params = useParams();
  const conversationId = params.id ?? "";

  //
  const [conversationItems, setConversationItems] = useState<string[]>([]);

  //
  const { data } = useQuery({
    queryKey: ["get-document-list"],
    queryFn: async () => {
      const result = await axiosInstance.get<string[]>("/list_documents");
      const newData = result.data ?? [];

      return newData;
    },
  });

  //
  useEffect(() => {
    if (!data) return;

    // If no converation goto new conversation page
    if (!data.length) {
      navigate("/file-upload");
      return;
    }

    // Set list of conversation
    setConversationItems(data);

    // Navigate to conversation details
    if (!conversationId || (conversationId && !data.includes(conversationId))) {
      navigate(`/conversations/${encodeURIComponent(data[0])}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //
  return (
    <div className="min-w-[369px] max-w-[369px] border-r border-gray-200 bg-gray-50">
      <div className="sticky top-0 h-14 w-full border-b border-gray-200 bg-white px-3 py-4">
        <p>{t("general.title")}</p>
      </div>

      <div className="h-full overflow-y-auto px-3 pb-20 pt-5">
        {/* New conversation */}
        <div className="mb-5 flex justify-center">
          <a
            href="/file-upload"
            className="flex items-center gap-3 rounded-md bg-gray-900 px-6 py-3 text-sm text-gray-100 shadow transition-all duration-300 hover:scale-105"
          >
            <div className="flex-shrink-0">
              <BsFillChatDotsFill />
            </div>
            <p>{t("conversation.new")}</p>
          </a>
        </div>

        {/* Existing conversation history */}
        <div className="flex flex-col gap-2">
          {conversationItems.map((item, index) => (
            <Link
              key={index}
              className={classNames(
                "flex items-center gap-3 rounded px-2 py-2 md:px-4 md:py-3",
                conversationId?.toLowerCase() ===
                  encodeURIComponent(item?.toLowerCase())
                  ? "border border-primary bg-primary/50 shadow"
                  : "border border-gray-100 bg-white shadow-sm hover:bg-gray-200 hover:shadow",
              )}
              to={`/conversations/${encodeURIComponent(item)}`}
            >
              <BsChatLeftDotsFill size={14} className="flex-shrink-0" />
              <p className="overflow-hidden text-ellipsis">
                {snakeCaseToTitleCase(item)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
