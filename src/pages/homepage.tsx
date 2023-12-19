import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//
import Loader from "../components/reusable/loader";

/**
 *
 */
export default function HomePage() {
  const navigate = useNavigate();

  //
  useEffect(() => {
    navigate("/conversations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  return (
    <div>
      <Loader />
    </div>
  );
}
