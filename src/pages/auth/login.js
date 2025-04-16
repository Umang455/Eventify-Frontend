import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useUserStore } from "src/store/useStore";
import axios from "axios";
import { loginAPI } from "src/config/api";
import { toast } from "react-toastify";

const Page = () => {
  const [userDetailsStore, setUserDetailsStore] = useUserStore((state) => [
    state.userDetailsStore,
    state.updateUserDetails,
  ]);

  const [loginAs, setLoginAs] = useState("EventHead")

  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      // loginAs: "Student",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("click");
      try {
        // await auth.signIn(values.email, values.password);
        let res = await axios.post(loginAPI, { email: values.email, password: values.password, loginAs: loginAs });
        console.log(res.data);
        const resp = res.data;
        setUserDetailsStore(resp);
        router.push("/events");
        toast.success("Logged in Successfully")
      } catch (err) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);


  const handleSkip = useCallback(() => {
    auth.skip();
    router.push("/");
  }, [auth, router]);

  return (
    <>
      <Head>
        <title>Login | Eventify</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F609B 0%, #1a237e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }
        }}
      >
        <Paper
          elevation={24}
          sx={{
            maxWidth: 550,
            width: '100%',
            p: 4,
            m: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255,255,255,0.3)'
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              color="rgba(255,255,255,0.7)"
              variant="body1"
              sx={{ textAlign: 'center' }}
            >
              Don&apos;t have an account? &nbsp;
              <Link
                component={NextLink}
                href="/auth/register"
                underline="hover"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': { color: 'white' }
                }}
              >
                Register
              </Link>
            </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
                {/* <Autocomplete
                  options={["Admin", "User", "Eventhead"]}
                  value={loginAs}
                  onChange={(e, newValue) => setLoginAs(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Login as"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(5px)',
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.4)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                      }}
                    />
                  )}
                /> */}
              </Stack>

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  background: 'linear-gradient(45deg, #0F609B 30%, #1a237e 90%)',
                  color: 'white',
                  height: 48,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1a237e 30%, #0F609B 90%)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  }
                }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
