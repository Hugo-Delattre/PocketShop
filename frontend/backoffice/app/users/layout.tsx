import React, { type PropsWithChildren } from "react";

function Layout({
  modals,
  children,
}: PropsWithChildren & { modals: React.ReactNode }) {
  console.log(modals);

  return (
    <div>
      <div>{modals}</div>
      {children}
    </div>
  );
}

export default Layout;
