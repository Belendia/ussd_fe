import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Chip,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextField, AutocompleteField } from "../../components";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../store/actions";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(4),
  },
  saving: {
    color: "#FFF",
    marginRight: "5px",
  },
}));

const validationSchema = yup.object({
  content: yup.string().required(),
  languages: yup.string().required(),
});

const MessageAdd = (props) => {
  const { className, staticContext, ...rest } = props;

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { error, lookup } = useSelector((state) => ({
    error: state.message.error,
    lookup: state.language.lookup,
  }));
  const [showError, setShowError] = useState(false);

  const handleCancel = () => {
    history.push("/message");
  };

  const handleClose = () => {
    setShowError(false);
  };

  return (
    <React.Fragment>
      <Formik
        validateOnChange={true}
        initialValues={{
          content: "",
          languages: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting, setErrors }) => {
          setSubmitting(true);

          dispatch(
            addMessage(data, history, (err) => {
              if (typeof err === "string") {
                setShowError(true);
              } else {
                setErrors(err);
              }

              setSubmitting(false);
            })
          );
        }}
      >
        {({ values, errors, isSubmitting }) => (
          <Card {...rest} className={clsx(classes.root, className)}>
            <Form autoComplete="off">
              <CardHeader subheader="Add a message" title="Message" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Field
                      name="languages"
                      component={AutocompleteField}
                      options={lookup}
                      multiple
                      getOptionLabel={(option) => option.label}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            label={option.label}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      textFieldProps={{
                        fullWidth: true,
                        margin: "normal",
                        variant: "outlined",
                        label: "Languages",
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Field
                      placeholder="Content"
                      name="content"
                      type="input"
                      multiline={true}
                      rows={10}
                      rowsMax={10}
                      variant="outlined"
                      label="Content"
                      margin="dense"
                      as={TextField}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <Button color="primary" variant="contained" type="submit">
                  {isSubmitting && (
                    <CircularProgress
                      variant="indeterminate"
                      disableShrink
                      className={classes.saving}
                      size={14}
                      thickness={4}
                    />
                  )}
                  Send
                </Button>
                <Button color="primary" variant="text" onClick={handleCancel}>
                  Cancel
                </Button>
              </CardActions>
            </Form>
          </Card>
        )}
      </Formik>

      <Snackbar open={showError} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

MessageAdd.propTypes = {
  className: PropTypes.string,
};

export default MessageAdd;