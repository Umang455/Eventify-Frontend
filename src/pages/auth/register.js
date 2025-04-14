import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Paper,
} from "@mui/material";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import axios from "axios";
import { registerUser } from "src/config/api";
import { toast } from "react-toastify";
import { useUserStore } from "src/store/useStore";

const Page = () => {
  const router = useRouter();

  // Make sure useUserStore is set up to support this destructuring
  const updateUserDetails = useUserStore((state) => state.updateUserDetails);

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      phone: "",
      address: "",
      role: "User",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      password: Yup.string()
        .max(255)
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const res = await axios.post(registerUser, {
          email: values.email,
          name: values.name,
          password: values.password,
          phone: values.phone,
          address: values.address,
          role: values.role,
          isAdmin: values.role === "Admin",
        });

        updateUserDetails(res.data);
        toast.success("Registered Successfully!");
        router.push("/events");
      } catch (err) {
        console.error("Registration error:", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({
          submit:
            err?.response?.data?.message || "Registration failed. Try again.",
        });
        helpers.setSubmitting(false);
        toast.error("Registration failed");
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Eventify</title>
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
              Create Account
            </Typography>
            <Typography
              color="rgba(255,255,255,0.7)"
              variant="body1"
              sx={{ textAlign: 'center' }}
            >
              Already have an account? &nbsp;
              <Link
                component={NextLink}
                href="/auth/login"
                underline="hover"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': { color: 'white' }
                }}
              >
                Log in
              </Link>
            </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
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
                  error={Boolean(formik.touched.email && formik.errors.email)}
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
                  error={Boolean(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Phone Number"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
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
                  error={Boolean(formik.touched.address && formik.errors.address)}
                  fullWidth
                  helperText={formik.touched.address && formik.errors.address}
                  label="Address"
                  name="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
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
                  error={Boolean(formik.touched.password && formik.errors.password)}
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
                <Autocomplete
                  options={["User", "EventHead", "Admin"]}
                  value={formik.values.role}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("role", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      error={Boolean(formik.touched.role && formik.errors.role)}
                      helperText={formik.touched.role && formik.errors.role}
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
                />
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
                Register
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
