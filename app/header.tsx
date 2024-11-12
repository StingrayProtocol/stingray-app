import { Button, Flex, Image } from "@/styled-antd";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/public/Stingray-Round.png";
import buttonBg from "@/public/button-background.png";
import { RightOutlined } from "@ant-design/icons";
import useGetOwnedTraderCard from "@/application/query/use-get-owned-trader-card";
import MainButton from "@/common/main-button";
import { getWalrusDisplayUrl } from "@/common/walrus-api";

const Header = () => {
  const router = useRouter();
  const { data: traderCard } = useGetOwnedTraderCard();
  const navs = [
    {
      title: "Pools",
      href: "/pools",
    },
    {
      title: "Trade",
      href: "/trade",
    },
    {
      title: "Arena",
      href: "/arena",
    },
  ];
  const pathname = usePathname();

  const isDashboardOpen = pathname.startsWith("/dashboard");
  return (
    <Flex
      style={{
        borderRadius: "60px",
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "36px",
        marginBottom: "36px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "8px",
        zIndex: 1,
      }}
      align="center"
      gap="middle"
    >
      <Flex
        style={{
          width: "50px",
          height: "50px",
          flexShrink: 0,
        }}
      >
        <Image preview={false} alt="logo" src={logo.src} />
      </Flex>
      <Flex
        style={{
          width: "100%",
          marginLeft: "20px",
        }}
        gap="middle"
      >
        {navs.map((nav, i) => (
          <Button
            type="text"
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={() => {
              router.push(nav.href);
            }}
            key={i}
          >
            {nav.title}
          </Button>
        ))}
      </Flex>
      <Flex
        style={{
          borderRadius: "40px",
          backgroundColor: isDashboardOpen
            ? "rgba(255, 255, 255, 0.1)"
            : "transparent",
        }}
        align="center"
      >
        <MainButton
          onClick={() => {
            router.push("/dashboard/investor");
          }}
          type="text"
          size="middle"
          style={{
            margin: "0px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundImage: `url(${buttonBg.src})`,
            backgroundSize: "103%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "-2px -2px",
            border: "none",
          }}
        >
          {isDashboardOpen && <RightOutlined />}
          Dashboard
        </MainButton>
        {/* <Segmented
          style={{
            backgroundColor: "transparent",
            fontSize: "16px",
            fontWeight: "bold",
            maxWidth: isDashboardOpen ? "500px" : "0px",
            opacity: isDashboardOpen ? 1 : 0,
            transition: "all 0.3s",
            overflow: "hidden",
          }}
          options={dashboardNavs}
          value={pathname.split("/")?.[2] ?? "investor"}
          defaultValue={pathname.split("/")?.[2] ?? "investor"}
          onChange={(value) => {
            router.push(`/dashboard/${value}`);
          }}
        /> */}
        <Flex
          style={{
            maxWidth: isDashboardOpen ? "500px" : "0px",
            opacity: isDashboardOpen ? 1 : 0,
            transition: "all 0.3s",
            overflow: "hidden",
          }}
        >
          <Button
            onClick={() => {
              router.push(`/dashboard/trader`);
            }}
            style={{
              textShadow:
                pathname.split("/")?.[2] === "trader"
                  ? "0px 0px 10px #fff"
                  : "none",
            }}
            type="text"
            size="middle"
          >
            Trader
          </Button>
          <Button
            onClick={() => {
              router.push(`/dashboard/investor`);
            }}
            style={{
              textShadow:
                pathname.split("/")?.[2] === "investor"
                  ? "0px 0px 10px #fff"
                  : "none",
            }}
            type="text"
            size="middle"
          >
            Investor
          </Button>
        </Flex>
      </Flex>
      <Flex
        style={{
          width: "50px",
          height: "50px",
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: "50%",
        }}
      >
        <Image
          preview={false}
          alt=""
          src={
            traderCard?.image_blob_id
              ? getWalrusDisplayUrl(traderCard?.image_blob_id)
              : logo.src
          }
        />
      </Flex>
    </Flex>
  );
};

export default Header;
