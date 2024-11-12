"use client";
import { Flex, Image } from "@/styled-antd";
import bgCover from "@/public/stingray_website_bg.png";
import Header from "./header";

const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <Image
        preview={false}
        alt="bg"
        src={bgCover.src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: -1,
        }}
      />
      <Flex
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
        vertical
      >
        <Header />
        {children}
      </Flex>
    </Flex>
  );
};

export default Frame;
