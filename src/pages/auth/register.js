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
        <title>Register | Event Platform</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
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
                sx={{ mt: 3, backgroundColor: "#0F609B" }}
                type="submit"
                variant="contained"
              >
                Register
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
