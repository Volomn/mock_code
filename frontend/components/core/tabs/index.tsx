"use client";
import clsx from "clsx";
import { Button, Drawer, Textarea, Group, Text, rem } from "@mantine/core";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import { Description } from "@/components/competition/description";
import { Leaderboard } from "@/components/competition/leaderboard";
import { Submissions } from "@/components/competition/submissions";

type tabs = "description" | "submissions" | "leaderboard";
export function Tabs() {
  const [activeTab, setActiveTab] = useState<tabs>("description");
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <section>
      <div className="flex items-center border-b-2">
        <Tab
          _key="description"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          Description
        </Tab>
        <Tab
          _key="submissions"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          Submissions
        </Tab>
        <Tab
          _key="leaderboard"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        >
          Leaderboard
        </Tab>

        <Button
          className="bg-primary-01 hover:bg-primary-01 ml-auto"
          onClick={() => setDrawerOpen(true)}
        >
          Submit answer
        </Button>
      </div>
      <div className="p-12 py-5">
        {activeTab === "description" && <Description />}
        {activeTab === "submissions" && <Submissions />}
        {activeTab === "leaderboard" && <Leaderboard />}
      </div>

      <Drawer
        opened={drawerOpen}
        position="right"
        title={
          <span className="font-semibold text-primary-01 dark:text-white">
            Submit File
          </span>
        }
        onClose={() => setDrawerOpen(false)}
        classNames={{
          content: "dark:bg-black",
          header: "dark:bg-black",
        }}
      >
        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          className="dark:bg-black"
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: rem(220), pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              {/* <IconUpload
                size="3.2rem"
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              /> */}
            </Dropzone.Accept>
            <Dropzone.Reject>
              {/* <IconX
                size="3.2rem"
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              /> */}
            </Dropzone.Reject>
            <Dropzone.Idle>
              {/* <IconPhoto size="3.2rem" stroke={1.5} /> */}
            </Dropzone.Idle>

            <div className="dark:bg-black dark:text-white">
              <Text size="xl" inline>
                Drag and drop
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                your file here or browse
              </Text>
            </div>
          </Group>
        </Dropzone>

        <Textarea
          label="Description"
          labelProps={{ className: "dark:text-neutral-01 mb-2" }}
          placeholder="Enter a description"
          rows={100}
          className="mt-5"
          classNames={{ input: "h-[250px] dark:bg-black dark:text-white" }}
        />

        <Button
          className="bg-primary-01 hover:bg-primary-01 mt-5"
          size="lg"
          fullWidth
        >
          Submit answer
        </Button>
      </Drawer>
    </section>
  );
}

function Tab({
  children,
  activeTab,
  setActiveTab,
  _key,
}: {
  children: ReactNode;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<tabs>>;
  _key: tabs;
}) {
  const isActiveTab = activeTab === _key;

  return (
    <div
      className={clsx(
        "px-4 py-5 cursor-pointer dark:text-white",
        isActiveTab && "border-b-2 border-b-primary-01 dark:border-b-slate-300"
      )}
      onClick={() => setActiveTab(_key)}
    >
      {children}
    </div>
  );
}
