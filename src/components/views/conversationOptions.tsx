import { Fragment } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";

//
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

//
interface IConversationOptionsProps {
  isLoading?: boolean;
  onClear?: () => void;
  onDelete?: () => void;
}

/**
 *
 */
export default function ConversationOptions(props: IConversationOptionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  //
  const queryParams = useParams();
  const conversationId = queryParams.id;

  //
  function uploadDocuments() {
    navigate(`/file-upload?cId=${conversationId}`);
  }

  //
  return (
    <div className="flex items-center justify-center">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center justify-center">
          <Menu.Button
            disabled={props.isLoading}
            className="disabled:cursor-not-allowed"
          >
            <BsThreeDotsVertical size={24} />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-30 mt-3 min-w-max origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => uploadDocuments()}
                    className={classNames(
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                      { "bg-primary/30 text-gray-800": active },
                    )}
                  >
                    {t("conversation.addDocuments")}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => props.onClear?.()}
                    className={classNames(
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                      { "bg-primary/30 text-gray-800": active },
                    )}
                  >
                    {t("conversation.clear")}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => props.onDelete?.()}
                    className={classNames(
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                      { "bg-primary/30 text-gray-800": active },
                    )}
                  >
                    {t("conversation.delete")}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
