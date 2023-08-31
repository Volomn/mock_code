import Link from "next/link";
import { useState } from "react";
import {
  Anchor,
  Avatar,
  Burger,
  Button,
  Container,
  Flex,
  Group,
  MediaQuery,
  Menu,
  Paper,
  Stack,
  Text,
  Transition,
  clsx,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useAuthStatus, useLogout } from "@/hooks/auth";

import DarkModeToggle from "./dark-mode-toggle";
import UserIcon from "@/public/user-icon.svg";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

export function Navbar() {
  const [opened, setOpened] = useState(false);
  const [isAuthenticated] = useAuthStatus();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const logout = useLogout();
  return (
    <>
      <Container size="xl" style={{ height: "100%" }}>
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          <Text
            size={24}
            className={clsx(
              dark ? "text-white" : "text-primary-01",
              "font-secondary"
            )}
            weight="bold"
            component={Link}
            href="/"
          >
            Mock
          </Text>

          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              // color={theme.colors.gray[6]}
              mr="xl"
              style={{ marginInline: 0 }}
            />
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Group>
              <DarkModeToggle />

              {isAuthenticated && (
                <Button
                  size="md"
                  className={clsx(dark ? "text-white" : "text-[#1B2063]")}
                  onClick={logout}
                  variant="white"
                >
                  Logout
                </Button>
              )}

              <Menu>
                <Menu.Target>
                  <Paper
                    radius="100%"
                    bg="#989FCE1A"
                    h={54}
                    w={54}
                    className="flex items-center justify-center"
                  >
                    <UserIcon />
                  </Paper>
                </Menu.Target>

                <Menu.Dropdown>
                  <Stack>
                    <Anchor href="#!">
                      <Button
                        size="lg"
                        variant="outline"
                        leftIcon={<GoogleIcon />}
                        className={clsx(
                          dark
                            ? "text-white border-white"
                            : "text-[##1B2063] border-[#1B2063]",
                          "font-secondary hover:bg-transparent"
                        )}
                        style={{ fontWeight: 400 }}
                      >
                        Continue with Google
                      </Button>
                    </Anchor>
                    <Anchor href="#!">
                      <Button
                        size="lg"
                        variant="outline"
                        leftIcon={<GithubIcon />}
                        className={clsx(
                          dark
                            ? "text-white border-white"
                            : "text-[##1B2063] border-[#1B2063]",
                          "font-secondary hover:bg-transparent"
                        )}
                        style={{ fontWeight: 400 }}
                      >
                        Continue with Github
                      </Button>
                    </Anchor>
                  </Stack>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </MediaQuery>
        </Flex>
      </Container>

      {opened && (
        <Transition
          mounted={opened}
          transition={scaleY}
          duration={200}
          timingFunction="ease"
        >
          {(styles) => (
            <Paper
              shadow="md"
              style={{
                ...styles,
                position: "absolute",
                top: 90,
                left: 0,
                right: 0,
                // height: rem(120),
              }}
              px={20}
              py={24}
              //   ref={clickOutsideRef}
            >
              <Stack>
                <DarkModeToggle />

                <Stack spacing={0} style={{ borderTop: "1px solid #989FCE1A" }}>
                  {isAuthenticated && (
                    <Button
                      size="lg"
                      className={clsx(dark ? "text-white" : "text-[#1B2063]")}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          )}
        </Transition>
      )}
    </>
  );
}
