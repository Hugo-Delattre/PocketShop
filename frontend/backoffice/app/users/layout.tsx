import React, { type PropsWithChildren } from "react";

function Layout({
  modals,
  children,
}: PropsWithChildren & { modals: React.ReactNode }) {
  return (
    <>
      <div>{modals}</div>
      {children}
    </>
  );
}

export default Layout;
