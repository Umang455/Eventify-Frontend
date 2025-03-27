import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import axios from 'axios';
import { getEvents } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { EventAdd } from 'src/sections/event/eventAdd';
import { EventTable } from 'src/sections/event/eventTable';

const Page = () => {
    const [userDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        _getData();
    }, [page, rowsPerPage]);

    async function _getData() {
        try {
            let res = await axios.get(getEvents);
            const sortedActivities = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setActivities(sortedActivities);
        } catch (e) {
            console.log(e);
        }
    }

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    return (
        <>
            <Head>
                <title>Events | Eventify</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" spacing={4}>
                            <Stack spacing={1}>
                                <Typography variant="h4">Events</Typography>
                            </Stack>
                            <div>
                                {!userDetails?.isFaculty && (
                                    <Button
                                        startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                                        variant="contained"
                                        onClick={() => setOpenAddModal(true)}
                                    >
                                        Add
                                    </Button>
                                )}
                            </div>
                        </Stack>
                        <EventTable
                            count={activities.length}
                            items={activities}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </Stack>
                </Container>
            </Box>
            <EventAdd open={openAddModal} setOpen={setOpenAddModal} getData={_getData} />
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
