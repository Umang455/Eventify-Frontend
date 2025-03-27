import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useState } from "react";
import _ from "lodash";
import axios from "axios";
import { deleteCompanySnippet, deleteProjectCommunicationAPI } from "src/config/api";
import { CommunicationSnippetEdit } from "src/components/communicationSnippets/communicationSnippetEdit";
import { toast } from "react-toastify";
import { CommunicationSnippetView } from "src/components/communicationSnippets/communicationSnippetView";
import moment from "moment";
import { ProjectCommunicationView } from "src/components/ProjectCommunication/projectCommunicationView";

export const ProjectCommunicationTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    getCommunications,
    getSnippets,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const [searchTerm, setSearchTerm] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  let data = items;

  if (searchTerm !== "") {
    data = _.filter(data, (i) => {
      return i.snippetTitle && i.snippetTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  async function _deleteCommunication(id) {
    try {
      let res = await axios.delete(deleteProjectCommunicationAPI(id));
      console.log(res);
      getCommunications();
      toast.success("Deleted Successfully");
    } catch {}
  }

  return (
    <>
      <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search Communications"
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      </Card>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                                    <Checkbox
                                    checked={selectedAll}
                                    indeterminate={selectedSome}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            onSelectAll?.();
                                        } else {
                                            onDeselectAll?.();
                                        }
                                    }}
                                    />
                                </TableCell> */}
                  <TableCell>Sr No.</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>With</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((communication, index) => (
                  <TableRow key={communication._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{communication.project.name}</TableCell>
                    <TableCell>{communication.from.name}</TableCell>
                    <TableCell>{communication.with.name}</TableCell>
                    <TableCell>{communication.type}</TableCell>
                    <TableCell>{moment(communication.initDate).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => _deleteCommunication(communication._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setOpenViewModal(true);
                          setSelectedSnippet(communication);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setOpenEditModal(true);
                          setSelectedSnippet(communication);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {/* <CommunicationSnippetEdit
        open={openEditModal}
        setOpen={setOpenEditModal}
        item={selectedSnippet}
        getSnippets={getSnippets}
      />
      <CommunicationSnippetView
        open={openViewModal}
        setOpen={setOpenViewModal}
        item={selectedSnippet}
      /> */}
      <ProjectCommunicationView open={openViewModal} setOpen={setOpenViewModal} />
    </>
  );
};

// CompanySnippetsTable.propTypes = {
//     count: PropTypes.number,
//     items: PropTypes.array,
//     onDeselectAll: PropTypes.func,
//     onDeselectOne: PropTypes.func,
//     onPageChange: PropTypes.func,
//     onRowsPerPageChange: PropTypes.func,
//     onSelectAll: PropTypes.func,
//     onSelectOne: PropTypes.func,
//     page: PropTypes.number,
//     rowsPerPage: PropTypes.number,
//     selected: PropTypes.array
// };
