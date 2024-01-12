import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';
import { socket } from '../Apis/socket';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function GroupForm({contacts,userId,mutateGrps}) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [grpname, setGrpname] = React.useState('')
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value.name === 'string' ? value.split(',') : value,
    );
  };
  const [open, setOpen] = React.useState(false);
  const createGroup = () => {
    const members = [];
    for (const user of contacts) {
        if (personName.includes(user.name)) {
            members.push(user._id);
        }
    }
    console.log(members)
    socket.emit('createGroup',{members,userId,grpname})
    mutateGrps()
    setOpen(false);
  }
  React.useEffect(()=>{
    console.log(personName)
  },[personName])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant='contained' color='primary' size='small' onClick={handleClickOpen}>
        Create Group
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a Group with atleast one member
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={grpname}
            onChange={(e) => setGrpname(e.target.value)}
          />
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" fullWidth />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {contacts?.map((user) => (
                <MenuItem
                  key={user._id}
                  value={user.name}
                  style={getStyles(user._id, personName, theme)}
                >
                  {user.name}
                </MenuItem>
              ))}
            </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createGroup}>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}