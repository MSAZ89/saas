import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "util/auth";
import { useItem, updateItem, createItem } from "util/db";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: 24,
  },
}));

const nsfw = [
  {
    value: "true",
    label: "Yes",
  },
  {
    value: "false",
    label: "No",
  },
];

function EditItemModal(props) {
  const classes = useStyles();

  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch item if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new item.
  const { data: itemData, status: itemStatus } = useItem(props.id);

  // If we are updating an existing item
  // don't show modal until item data is fetched.
  if (props.id && itemStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateItem(props.id, data)
      : createItem({ owner: auth.user.uid, ...data });

    query
      .then(() => {
        // Let parent know we're done so they can hide modal
        props.onDone();
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
  };

  return (
    <Dialog fullWidth={true} open={true} onClose={props.onDone}>
      <DialogTitle>
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}Link
      </DialogTitle>
      <DialogContent className={classes.content}>
        {formAlert && (
          <Box mb={4}>
            <Alert severity={formAlert.type}>{formAlert.message}</Alert>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container={true} spacing={3}>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                type="text"
                label="Name"
                name="name"
                defaultValue={itemData && itemData.name}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
                fullWidth={true}
                autoFocus={true}
                inputRef={register({
                  required: "Please enter a name",
                })}
              />
              <Box my={2}></Box>
              <TextField
                variant="outlined"
                multiline={true}
                type="text"
                label="Description"
                name="description"
                defaultValue={itemData && itemData.description}
                error={errors.description ? true : false}
                helperText={errors.description && errors.description.message}
                fullWidth={true}
                inputRef={register({})}
              />
              <Box my={2}></Box>
              <TextField
                variant="outlined"
                multiline={false}
                type="url"
                label="Url"
                name="url"
                defaultValue={itemData && itemData.url}
                error={errors.url ? true : false}
                helperText={errors.url && errors.url.message}
                fullWidth={true}
                inputRef={register({
                  required: "Please enter a valid url",
                })}
              />

              <Box my={2}></Box>
              <TextField
                id="outlined-select-currency"
                label="SFW"
                type="select"
                name="sfw"
                defaultValue={itemData && itemData.sfw}
                error={errors.sfw ? true : false}
                helperText="Is this safe for work?"
                inputRef={register()}
              >
                {nsfw.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={pending}
              >
                {!pending && <span>Save</span>}

                {pending && <CircularProgress size={28} />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditItemModal;
