import React from "react";
import LegacyNavbar from "../Navbar";

type AppNavbarProps = React.ComponentProps<typeof LegacyNavbar>;

export default function AppNavbar(props: AppNavbarProps) {
  return <LegacyNavbar {...props} />;
}
