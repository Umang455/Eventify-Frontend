import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Card, Container, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { ProjectAdd } from 'src/components/projects/projectAdd';
import { ProjectsTable } from 'src/sections/projects/projectsTable';
import axios from 'axios';
import { getAllProjectsAPI, getFacultyAPI } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { FacultyTable } from 'src/sections/faculty/facultyTable';
import { FacultyAdd } from 'src/sections/faculty/facultyAdd';

const now = new Date();

const data = []

const useCustomers = (page, rowsPerPage) => {
    return useMemo(
        () => {
            return applyPagination(data, page, rowsPerPage);
        },
        [page, rowsPerPage]
    );
};

const useCustomerIds = (customers) => {
    return useMemo(
        () => {
            return customers.map((customer) => customer.id);
        },
        [customers]
    );
};
// import axios from 'axios';




const Page = () => {

    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])

    console.log(userDetails, "This is my user")


    const [openAddModal, setOpenAddModal] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [faculties, setFaculties] = useState([])



    useEffect(() => {
        _getData()
    }, [])


    async function _getData() {
        try {
            let res = await axios.get(getFacultyAPI)
            console.log(res.data)
            setFaculties(res.data)
            // setProjects(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    const handleRowsPerPageChange = useCallback(
        (event) => {
            setRowsPerPage(event.target.value);
        },
        []
    );

    return (
        <>
            <Head>
                <title>
                    Users | Eventify
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Users List
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >

                                </Stack>
                            </Stack>
                            <div>
                                <Button
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    onClick={() => setOpenAddModal(true)}
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        <FacultyTable
                            getData={_getData}
                            items={faculties}
                        />
                    </Stack>
                </Container>
            </Box>
            <FacultyAdd open={openAddModal} setOpen={setOpenAddModal} getData={_getData} />
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
