import Link from "next/link";
import { useState } from "react";
import {
  Burger,
  Button,
  Container,
  Flex,
  Group,
  MediaQuery,
  Paper,
  Stack,
  Text,
  Transition,
  clsx,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import DarkModeToggle from "./dark-mode-toggle";
import { useAuthStatus, useLogout } from "@/hooks/auth";

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
          <Text size={24} weight="bold" component={Link} href="/">
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

              {isAuthenticated ? (
                <Button
                  size="md"
                  className={clsx(dark ? "text-white" : "text-[#1B2063]")}
                  onClick={logout}
                  variant="white"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="md" variant="white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="md"
                      className="bg-[#1B2063] hover:bg-[#1B2063]"
                      variant="filled"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
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
                  {isAuthenticated ? (
                    <Button
                      size="lg"
                      className={clsx(dark ? "text-white" : "text-[#1B2063]")}
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link href={`/login`}>
                        <Button size="lg" fullWidth variant="white">
                          Login
                        </Button>
                      </Link>
                      <Link href={`/sign-up`}>
                        <Button
                          size="lg"
                          className="bg-[#1B2063] hover:bg-[#1B2063]"
                          fullWidth
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
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
