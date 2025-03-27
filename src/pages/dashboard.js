import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Button, Card, CardActions, CardHeader, CardMedia, Container, Divider, Unstable_Grid2 as Grid, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useUserStore } from 'src/store/useStore';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import { baseUrl } from 'src/config/api';

const now = new Date();


const Page = () => {

    const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])

    // clg

    console.log(userDetails, "My detailsss")

    return (


        <>
            <Head>
                <title>
                    Dashboard | Eventify
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
                    <Grid
                        container
                        spacing={3}
                    >
                         <>

                            <Grid
                                xs={12}
                                sm={6}
                                lg={4}
                            >
                                <OverviewBudget
                                    difference={12}
                                    positive
                                    sx={{ height: '100%' }}
                                    value="$24k"
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                sm={6}
                                lg={4}
                            >
                                <OverviewTotalCustomers
                                    difference={16}
                                    positive={false}
                                    sx={{ height: '100%' }}
                                    value="1.6k"
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                sm={6}
                                lg={4}
                            >
                                <OverviewTasksProgress
                                    sx={{ height: '100%' }}
                                    value={75.5}
                                />
                            </Grid>
                            {/* <Grid
                                xs={12}
                                sm={6}
                                lg={3}
                            >
                                <OverviewTotalProfit
                                    sx={{ height: '100%' }}
                                    value="$15k"
                                />
                            </Grid> */}
                            {/* <Grid
                                xs={12}
                                lg={8}
                            >
                                <OverviewSales
                                    chartSeries={[
                                        {
                                            name: 'This year',
                                            data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                                        },
                                        {
                                            name: 'Last year',
                                            data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                                        }
                                    ]}
                                    sx={{ height: '100%' }}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <OverviewTraffic
                                    chartSeries={[63, 15, 22]}
                                    labels={['Desktop', 'Tablet', 'Phone']}
                                    sx={{ height: '100%' }}
                                />
                            </Grid> */}
                        </>
                            
                                <>
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <Card sx={{ height: '100%', }}  >
                                            {/* <CardHeader title="My Details" > </CardHeader> */}
                                            <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', marginY: 5 }}>
                                                <img src={baseUrl + 'public/uploads/' + userDetails?.image} style={{ width: 150, height: 150 }} />
                                            </Box>
                                            <Divider />
                                            <Box padding={3}>
                                                <Stack spacing={2}>
                                                    <Typography variant='h6'  > Name : {userDetails?.name}</Typography>
                                                    <Typography   > Number : {userDetails?.phone}</Typography>
                                                    <Typography   > Email : {userDetails?.email}</Typography>
                                                    <Typography   > Address : {userDetails?.address}</Typography>

                                                </Stack>
                                            </Box>
                                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                                {/* <Button
                                                    color="inherit"
                                                    endIcon={(
                                                        <SvgIcon fontSize="small">
                                                            <ArrowRightIcon />
                                                        </SvgIcon>
                                                    )}
                                                    size="small"
                                                    variant="text"
                                                >
                                                    View all
                                                </Button> */}
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={12}
                                        lg={8}
                                    >
                                        <OverviewLatestOrders
                                            orders={userDetails?.coursesRegistered}
                                            sx={{ height: '100%' }}
                                        />
                                    </Grid></>
                            


                    </Grid>
                </Container>
            </Box>
        </>
    );
}
Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
