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
            <div className={styles.wrapper__inner}>
              <div className={styles.content}>
                <div className="flex min-h-screen">
                  <div className={styles.content__inner}>{children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
