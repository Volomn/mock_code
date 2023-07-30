import Image from "next/image";
import BannerVector from "@/public/banner-vector.png";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";

import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Skeleton,
  Text,
} from "@mantine/core";
import { AppLayout } from "@/layouts/app-layout";
import { sora } from "@/utils/fonts";
import { useGetGithubAuthUrl, useGetGoogleAuthUrl } from "@/api/auth";
import { getGithubAuthDetails, getGoogleAuthDetails } from "@/api/lib";

export default function Home({
  githubAuthDetails,
  googleAuthDetails,
}: {
  githubAuthDetails: { to: string };
  googleAuthDetails: { to: string };
}) {

  
  return (
    <AppLayout>
      <Center style={{ height: "calc(100vh - 90px)" }}>
        <Container
          size={700}
          style={{ textAlign: "center", fontFamily: "var(--font-sora)" }}
          className={sora.className}
        >
          <Text
            size={48}
            weight={600}
            style={{ lineHeight: "56px", fontFamily: "var(--font-sora)" }}
          >
            Code like a hero, change the world like a legend.
          </Text>
          <Text
            py={16}
            size={18}
            weight={300}
            className="font-secondary"
            style={{ color: "#312A50" }}
          >
            Lorem ipsum dolor sit amet consectetur. Turpis ipsum etiam id nisi
            tempus sed elementum at. Pellentesque morbi imperdiet egestas.
          </Text>
          <Group position="center" mt={16} mb={32}>
            <Anchor href={googleAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<GoogleIcon />}
                className="font-primary"
                style={{ fontWeight: 400 }}
              >
                Sign up with Google
              </Button>
            </Anchor>
            <Anchor href={githubAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<GithubIcon />}
                className="font-primary"
                style={{ fontWeight: 400 }}
              >
                Sign up with Github
              </Button>
            </Anchor>
          </Group>

          <Image src={BannerVector} quality={100} alt="vector" />
        </Container>
      </Center>
    </AppLayout>
  );
}

export async function getServerSideProps() {
  const googleAuthDetails = await getGoogleAuthDetails();
  const githubAuthDetails = await getGithubAuthDetails();

  console.log({ githubAuthDetails, googleAuthDetails });
  return {
    props: {
      googleAuthDetails,
      githubAuthDetails,
    },
  };
}
