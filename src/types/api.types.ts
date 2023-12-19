export interface IApiChatItem {
  query: string;
  response: string;
}

export interface IApiChatHistoryResponse {
  chat_history: IApiChatItem[];
}

export interface IApiAskQuestionResponse {
  question: string;
  answer: string;
}

export interface IUploadDocumentResponse {
  "Created a new collection ": string;
  "Created a new collection": string;
  "Updated an existing collection ": string;
  "Updated an existing collection": string;
  answer: string;
  error?: string;
}

export interface ISummarizeResponse {
  answer: string;
}
