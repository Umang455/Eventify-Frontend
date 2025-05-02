import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Card, Container, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from 'axios';
import { getActivitiesAPI, getAllProjectsAPI, getCourseAPI, getFacultyAPI } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { ActivityAdd } from 'src/sections/activities/activityAdd';
import { ActivityTable } from 'src/sections/activities/activityTable';

const now = new Date();

const data = []



const Page = () => {

    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])

    console.log(userDetails, "This is my user")


    const [openAddModal, setOpenAddModal] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [faculties, setFaculties] = useState([])
    const [activities, setActivities] = useState([])



    useEffect(() => {
        _getData()
    }, [])


    async function _getData() {
        try {
            let query = `?studentID=${userDetails._id}`
            if (userDetails.isFaculty) {
                query = ""
            }
            let res = await axios.get(getActivitiesAPI + query)
            console.log(res.data)
            setActivities(res.data)
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
                    Activities | Eventifyy
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
                                    {userDetails?.isFaculty ? "Student Activities" : "Your Activities"}
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >

                                </Stack>
                            </Stack>
                            <div>
                                {!userDetails?.isFaculty ?
                                    (

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
                                    ) : null}
                            </div>
                        </Stack>
                        <ActivityTable
                            // count={projects.length}
                            items={activities}
                        />
                    </Stack>
                </Container>
            </Box>
            <ActivityAdd open={openAddModal} setOpen={setOpenAddModal} getData={_getData} />
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
