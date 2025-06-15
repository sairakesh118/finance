"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

export default function ClientProviders({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </Provider>
    </ClerkProvider>
  );
}
