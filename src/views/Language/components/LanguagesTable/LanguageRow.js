import React, { useState } from "react";
import { TableCell, TableRow, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {},
  menu: {
    minWidth: 40,
  },
}));

const LanguageRow = (props) => {
  const { language } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //redux
  const { permissions } = useSelector((state) => ({
    permissions: state.language.permissions,
  }));

  const editPermission = permissions.includes("can_put");
  const deletePermission = permissions.includes("can_delete");

  let editMenu = null;
  if (editPermission) {
    editMenu = (
      <MenuItem onClick={handleClose}>
        <ListItemIcon className={classes.menu}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>
    );
  }

  let deleteMenu = null;
  if (deletePermission) {
    deleteMenu = (
      <MenuItem onClick={handleClose}>
        <ListItemIcon className={classes.menu}>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
    );
  }

  let menu = null;
  if (editPermission || deletePermission) {
    menu = (
      <React.Fragment>
        <IconButton
          aria-label="more"
          aria-controls="action-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {editMenu}

          {deleteMenu}
        </Menu>
      </React.Fragment>
    );
  }

  return (
    <TableRow className={classes.tableRow} hover key={language.id} size="small">
      <TableCell>
        <Typography variant="body1">{language.name}</Typography>
      </TableCell>
      <TableCell>{language.code}</TableCell>
      <TableCell>{menu}</TableCell>
    </TableRow>
  );
};

LanguageRow.propTypes = {
  language: PropTypes.object,
};

export default LanguageRow;