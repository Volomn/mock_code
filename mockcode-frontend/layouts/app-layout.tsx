import DarkModeToggle from "@/components/dark-mode-toggle";
import {
  Anchor,
  AppShell,
  Button,
  Container,
  Flex,
  Footer,
  Group,
  Header,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      footer={
        <Footer height={64}>
          <Container size="xl" style={{ height: "100%" }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ height: "100%" }}
            >
              <Text>
                © {new Date().getFullYear()} Volomn - All rights reserved
              </Text>

              <Group>
                <Anchor>Privacy Policy</Anchor>
                <Anchor>Terms & Conditions</Anchor>
              </Group>
            </Flex>
          </Container>
        </Footer>
      }
      header={
        <Header height={90}>
          <Container size="xl" style={{ height: "100%" }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ height: "100%" }}
            >
              <Text size={24} weight="bold" component={Link} href="/">
                Mock
              </Text>

              <Group>
                <DarkModeToggle />
                <Link href="/login">
                  <Button size="md" variant="white">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="md" variant="filled">
                    Sign Up
                  </Button>
                </Link>
              </Group>
            </Flex>
          </Container>
        </Header>
      }
      padding={0}
    >
      {children}
    </AppShell>
  );
}
