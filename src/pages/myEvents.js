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
import { getAllProjectsAPI, getFacultyAPI, getMyEvents } from 'src/config/api';
import { useUserStore } from 'src/store/useStore';
import { FacultyTable } from 'src/sections/faculty/facultyTable';
import { FacultyAdd } from 'src/sections/faculty/facultyAdd';
import { MyEventTable } from 'src/sections/event/myEventTable';
// import { EventAdd } from 'src/components/event/eventAdd';

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

async function getEventIdeas(prompt) {
    try {
        const response = await axios.post('https://api.your-gemini-endpoint.com/v1/generate-event-ideas', {
            prompt: prompt,
            maxIdeas: 3
        }, {
            headers: {
                'Authorization': `Bearer YOUR_API_KEY`,
                'Content-Type': 'application/json'
            }
        });

        const eventIdeas = response.data.ideas.map(idea => ({
            eventName: idea.eventName,
            catering: idea.catering,
            timing: idea.timing,
            estimatedPeople: idea.estimatedPeople,
            estimatedCost: idea.estimatedCost,
            venueOptions: idea.venueOptions,
            additionalNotes: idea.additionalNotes
        }));

        return eventIdeas;
    } catch (error) {
        console.error('Error fetching event ideas:', error);
        return [];
    }
}

// Example usage
getEventIdeas("Corporate annual meetup with team-building activities and dinner").then(ideas => {
    console.log(ideas);
});


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
            let res = await axios.post(getMyEvents, { userId: userDetails._id })
            console.log(res.data, "My events")
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
                    Myevents | Eventify
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
                                    Registered events
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >

                                </Stack>
                            </Stack>
                            {/* <div>
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
                            </div> */}
                        </Stack>
                        {faculties.length !== 0 ? (

                            <MyEventTable
                                getData={_getData}
                                items={faculties}
                            />
                        ) : <></>}
                    </Stack>
                </Container>
            </Box>
            {/* <EventAdd
                open={openAddModal}
                setOpen={setOpenAddModal}
                fetchEvents={_getData}
                userDetails={userDetails}
            /> */}
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
