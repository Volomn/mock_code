import DarkModeToggle from "@/components/dark-mode-toggle";
import { Navbar } from "@/components/navbar";
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
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <AppShell
      // footer={
      //   <Footer mih={64} height="fit-content">
      //     <Container size="xl" style={{ height: "100%" }}>
      //       <Flex
      //         justify="space-between"
      //         align={{ base: "flex-start", md: "center" }}
      //         style={{ height: "100%" }}
      //         direction={{ base: "column", md: "row" }}
      //         p={{ base: 20, md: 0 }}
      //       >
      //         <Text>
      //           © {new Date().getFullYear()} Volomn - All rights reserved
      //         </Text>

      //         <Group>
      //           <Anchor href="#!">Privacy Policy</Anchor>
      //           <Anchor href="#!">Terms & Conditions</Anchor>
      //         </Group>
      //       </Flex>
      //     </Container>
      //   </Footer>
      // }
      header={
        <Header height={90}>
          <Navbar />
        </Header>
      }
      padding={0}
    >
      {children}

      <footer>
        <Container py={20} size="xl" style={{ height: "100%" }}>
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            style={{ height: "100%" }}
            direction={{ base: "column", md: "row" }}
            p={{ base: 20, md: 0 }}
          >
            <Text>
              © {new Date().getFullYear()} Volomn - All rights reserved
            </Text>

            <Group>
              <Anchor
                href="https://app.getterms.io/view/y1KbZ/privacy/en-us"
                className={clsx(
                  dark ? "text-white" : "text-[#1B2063]",
                  "font-secondary text-xs"
                )}
              >
                Privacy Policy
              </Anchor>
              <Anchor
                href="https://app.getterms.io/view/y1KbZ/tos/en-us"
                className={clsx(
                  dark ? "text-white" : "text-[#1B2063]",
                  "font-secondary text-xs"
                )}
              >
                Terms & Conditions
              </Anchor>
            </Group>
          </Flex>
        </Container>
      </footer>
    </AppShell>
  );
}
