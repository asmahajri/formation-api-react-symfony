import React from "react";
import ContentLoader from "react-content-loader";

const FormLoader = (props) => {
  return (
    <ContentLoader
      viewBox="0 0 800 400"
      width={800}
      height={400}
      speed={2}
      {...props}
    >
      <rect x="20" y="20" rx="0" ry="0" width="100" height="20" />
      <rect x="20" y="50" rx="0" ry="0" width="400" height="20" />
      <rect x="20" y="100" rx="0" ry="0" width="100" height="20" />
      <rect x="20" y="130" rx="0" ry="0" width="400" height="20" />
      <rect x="20" y="180" rx="0" ry="0" width="100" height="20" />
      <rect x="20" y="210" rx="0" ry="0" width="400" height="20" />
      <rect x="20" y="250" rx="10" ry="10" width="100" height="30" />
      <rect x="130" y="260" rx="0" ry="0" width="80" height="10" />
    </ContentLoader>
  );
};

export default FormLoader;
