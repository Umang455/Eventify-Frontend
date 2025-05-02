import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useState } from 'react';
import _ from 'lodash';
import { useUserStore } from 'src/store/useStore';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import HailIcon from '@mui/icons-material/Hail';
import Groups3Icon from '@mui/icons-material/Groups3';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DateRangeIcon from '@mui/icons-material/DateRange';
export const SideNav = (props) => {

  const [userDetails, setUserDetails] = useUserStore(state => [state.userDetailsStore, state.updateUserDetails])


  const items = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      ),
      view: false,
    },
    {
      title: 'All Users',
      path: '/users',
      icon: (
        <Groups3Icon fontSize='small' />
      ),
      view: userDetails?.admin,
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: (
        <PersonPinIcon fontSize='small' />
      ),
      view: true,
    },

    {
      title: 'Events',
      path: '/events',
      icon: (
        <EventAvailableIcon fontSize='small' />
      ),
      view: true,
    },
    {
      title: 'My Created Events',
      path: '/my-created-events',
      icon: (
        <DateRangeIcon fontSize='small' />
      ),
      view: true,
    },
    {
      title: 'My Registered Events',
      path: '/my-registered-events',
      icon: (
        <WorkspacePremiumIcon fontSize='small' />
      ),
      view: true,
    },

  ];



  const { open, onClose } = props;
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("")
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  // const data = items._filter(items.name)
  let data = items


  if (searchTerm !== "") {
    data = _.filter(data, (i) => {
      return (
        (i.title &&
          i.title.toLowerCase().includes(searchTerm.toLowerCase()))

      );
    });
  }

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 100
            }}
          >
            {/* <Logo /> */}
            <Typography variant='h6'   >Eventifyy</Typography>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              p: '12px'
            }}
          >
            <div>
              <Typography
                color="inherit"
                variant="subtitle1"
              >
                Welcome
              </Typography>
              <Typography
                color="neutral.400"
                variant="body2"
              >
                {userDetails?.name}
              </Typography>
            </div>
            <SvgIcon
              fontSize="small"
              sx={{ color: 'neutral.500' }}
            >
              <ChevronUpDownIcon />
            </SvgIcon>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >

          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            <TextField variant='outlined' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ marginBottom: 2 }} InputProps={{
              style: {
                color: 'white',
                height: "35px",
                borderWidth: '0px' // Change this value to the desired color
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }} />
            {data.map((item) => {
              const active = item.path ? (pathname === item.path) : false;
              { console.log(item.view, "ha") }
              if (item.view) {
                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                  />

                );
              }
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 300
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: 10 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
502803500050280