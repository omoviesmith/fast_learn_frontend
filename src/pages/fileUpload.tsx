import classNames from "classnames";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

//
import { FiUploadCloud } from "react-icons/fi";

//
import axiosInstance from "../utils/axios";

//
import type { IUploadDocumentResponse } from "../types/api.types";

/**
 *
 */
export default function FileUploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  //
  const [params] = useSearchParams();
  const collectionId = params.get("cId");

  //
  const [inputUrl, setInputUrl] = useState<string>("");
  const [submitProgress, setSubmitProgress] = useState<number>(20);
  const [uploadMode, setUploadMode] = useState<"document" | "url">("document");

  //
  const uploadURLBase =
    uploadMode === "document" ? "/upload_anydoc" : "/enter_url";
  const updateURLBase =
    uploadMode === "document" ? "/update_anydoc" : "/enter_url";

  //
  const uploadURL = collectionId
    ? `${updateURLBase}/${encodeURIComponent(collectionId)}`
    : uploadURLBase;

  //
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  //
  const mutation = useMutation({
    mutationFn: async () => {
      setSubmitProgress(0);

      //
      let formItem;
      if (uploadMode === "document") {
        formItem = new FormData();
        for (const file of acceptedFiles) {
          formItem.set("input_pdf_file", file);
        }
      } else {
        formItem = { url: inputUrl };
      }

      const response = await axiosInstance.post<IUploadDocumentResponse>(
        uploadURL,
        formItem,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.max(
              Math.min(
                Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total ?? 100),
                ),
                100,
              ),
              0,
            );
            setSubmitProgress(percentCompleted);
          },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.error) return;

      //
      const conversationId =
        data["Created a new collection"] ??
        data["Created a new collection "] ??
        data["Updated an existing collection"] ??
        data["Updated an existing collection "];

      navigate(`/conversations/${encodeURIComponent(conversationId)}`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Unable to update the file");
    },
  });

  //
  const isSubmitting = mutation.isPending;
  const isSubmitDisabled = isSubmitting || !inputUrl.length;

  //
  function submitUrl() {
    if (isSubmitting) return;
    mutation.mutate();
  }

  //
  useEffect(() => {
    if (!acceptedFiles.length) return;
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  //
  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-100 p-2 md:p-5 lg:p-20">
      <div className="flex h-full w-full flex-col rounded-xl bg-white py-2 shadow-lg md:py-5 lg:py-10">
        {/* Header */}
        <div className="flex justify-between gap-20 border-b border-gray-200 px-2 pb-2 md:px-5 md:pb-5 lg:px-10 lg:pb-10">
          <p className="text-4xl font-semibold">
            {t("fileUpload.uploadDocuments")}
          </p>

          <p className="max-w-md text-center text-sm">
            {t("fileUpload.limitHint")}
          </p>
        </div>

        {isSubmitting && (
          <div className="h-full flex-grow">
            <div className="flex h-full flex-col items-center justify-center px-2 py-10 md:px-5 lg:px-10">
              <div className="h-5 w-full overflow-hidden rounded-full border border-gray-300 bg-gray-100 shadow">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${submitProgress}%` }}
                />
              </div>

              <div className="my-5 transition-all duration-1000">
                {submitProgress < 100 ? (
                  <span>{t("fileUpload.uploading")}</span>
                ) : (
                  <span>{t("fileUpload.processing")}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {!isSubmitting && (
          <div className="flex-grow">
            {/* Mode switch */}
            <div className="mt-10 px-2 md:px-5 lg:px-10">
              <div className=" max-w-fit rounded-full bg-gray-200 p-[5px]">
                <button
                  onClick={() => setUploadMode("document")}
                  className={classNames("rounded-full px-5 py-3 text-sm", {
                    "bg-white font-semibold shadow": uploadMode === "document",
                  })}
                >
                  {t("fileUpload.uploadFromFile")}
                </button>
                <button
                  onClick={() => setUploadMode("url")}
                  className={classNames("rounded-full px-5 py-3 text-sm", {
                    "bg-white font-semibold shadow": uploadMode === "url",
                  })}
                >
                  {t("fileUpload.uploadFromUrl")}
                </button>
              </div>
            </div>

            {/* Actual dropzone */}
            {uploadMode === "document" && (
              <div className="p-2 md:p-5 lg:p-10">
                <div
                  {...getRootProps({
                    className:
                      "flex h-60 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5",
                  })}
                >
                  <input {...getInputProps()} />

                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-5 rounded-full bg-gray-100 p-3">
                      <div className="rounded-full bg-gray-200 p-3 text-gray-600">
                        <FiUploadCloud size={32} />
                      </div>
                    </div>

                    <p className="text-sm">{t("fileUpload.uploadHint")}</p>
                    <p className="mt-1 text-xs">
                      {t("fileUpload.supportedFormats", {
                        formats: "'.pdf', '.txt', '.csv'",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uploadMode === "url" && (
              <div className="p-2 md:p-5 lg:p-10">
                <input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-0"
                />

                <div className="my-10 flex justify-end">
                  <button
                    disabled={isSubmitDisabled}
                    onClick={submitUrl}
                    className="flex items-center gap-3 rounded-full px-6 py-3 text-sm shadow transition-all duration-300 enabled:bg-gray-900 enabled:text-gray-100 enabled:hover:scale-[1.03] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-200"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* More content */}
        <div className="px-2 text-sm md:px-5 lg:px-10">
          <p>{t("fileUpload.agreeWith")}</p>

          <div className="flex gap-1">
            <a href="#" className="font-semibold hover:underline">
              {t("general.privacyPolicy")}
            </a>
            <p>&</p>
            <a href="#" className="font-semibold hover:underline">
              {t("general.terms")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
