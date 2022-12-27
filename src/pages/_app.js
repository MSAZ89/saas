import React from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { AuthProvider } from "util/auth";
import { ThemeProvider } from "util/theme";
import { QueryClientProvider } from "util/db";

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <>
            <Navbar
              color="default"
              logo="/linkboxlogo-dark.png"
              logoInverted="/linkboxlogo-light.png"
            />

            <Component {...pageProps} />

            <Footer
              bgColor="default"
              size="medium"
              bgImage=""
              bgImageOpacity={1}
              description="A place to store links."
              copyright={`© ${new Date().getFullYear()} Company`}
              logo="/linkboxlogo-dark.png"
              logoInverted="/linkboxlogo-light.png"
              sticky={true}
            />
          </>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
