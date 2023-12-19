import { createBrowserRouter } from "react-router-dom";

//
import ConversationLayout from "./layouts/conversation.layout";

//
import HomePage from "./pages/homepage";
import FileUploadPage from "./pages/fileUpload";
import ConverstaionListPage from "./pages/conversations/list";
import ConverstaionDetailPage from "./pages/conversations/detail";

//
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/file-upload",
    element: <FileUploadPage />,
  },
  {
    path: "/conversations",
    element: <ConversationLayout />,
    children: [
      {
        path: "",
        element: <ConverstaionListPage />,
      },
      {
        path: ":id",
        element: <ConverstaionDetailPage />,
      },
    ],
  },
]);

export default router;
