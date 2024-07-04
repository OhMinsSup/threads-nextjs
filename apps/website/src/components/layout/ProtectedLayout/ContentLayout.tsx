import React from "react";

import styles from "./styles.module.css";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <main className={styles.root}>
      <div className="relative">
        <div className="relative flex flex-col">
          <div className={styles.wrapper}>
            <div
              className="relative flex flex-col"
              style={{ minHeight: "inherit" }}
            >
              <div className="flex w-full content-center justify-center px-5">
                <div className="flex min-h-screen">
                  <div
                    className="relative flex flex-col"
                    style={{ minHeight: "inherit" }}
                  >
                    <div className="flex w-full items-center justify-center px-5">
                      <div className={styles.content}>
                        <div className={styles.content__container}>
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
