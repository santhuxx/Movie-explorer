import { useEffect } from "react";

const GoogleAd = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "20px 0" }}
      data-ad-client="ca-pub-7001636087856196"
      data-ad-slot="3101422978" // Use the provided ad slot
      data-ad-format="auto"
      data-full-width-responsive="true" // Match the responsive setting
    ></ins>
  );
};

export default GoogleAd;