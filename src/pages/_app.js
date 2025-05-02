import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useEffect } from "react";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  if (typeof document !== "undefined") {
    console.log("here1");
    // you are safe to use the "document" object here
    console.log("noiceeeeee", document.location.href);
  }
  useEffect(() => {
    console.log("here2");

    // you are safe to use the 'document' object here
    document.title = "Eventifyy";
  }, []);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Devias Kit</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {/* <AuthProvider> */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <AuthConsumer> */}
            {
              // (auth) => auth.isLoading
              //   ? <SplashScreen />
              //   :
              getLayout(<Component {...pageProps} />)
            }
            {/* </AuthConsumer> */}
          </ThemeProvider>
          {/* </AuthProvider> */}
        </MuiPickersUtilsProvider>
        <ToastContainer />
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
