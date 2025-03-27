import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const OverviewLatestOrders = (props) => {
  const { orders, sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Courses Registered" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800, padding: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Code
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell >
                  Semester
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((d, i) => {
                // const createdAt = format(d?.createdAt, 'dd/MM/yyyy');

                return (
                  <TableRow
                    hover
                    key={d?._id}
                  >
                    <TableCell>
                      {d?.code}
                    </TableCell>
                    <TableCell>
                      {d?.name}
                    </TableCell>
                    <TableCell>
                      {d?.semester}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[d?.status]}>
                        {d?.modules?.length}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
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
        </Button>
      </CardActions>
    </Card >
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
