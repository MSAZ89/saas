import React, { useState, useRef } from "react";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import StarIcon from "@material-ui/icons/Star";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import EditItemModal from "components/EditItemModal";
import { useAuth } from "util/auth";
import { updateItem, deleteItem, useItemsByOwner } from "util/db";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  paperItems: {
    minHeight: "300px",
  },
  featured: {
    backgroundColor:
      theme.palette.type === "dark" ? theme.palette.action.selected : "#fdf8c2",
  },
  starFeatured: {
    color: theme.palette.warning.main,
  },
}));

function DashboardItems(props) {
  const classes = useStyles();

  const auth = useAuth();

  const {
    data: items,
    status: itemsStatus,
    error: itemsError,
  } = useItemsByOwner(auth.user.uid);

  const [creatingItem, setCreatingItem] = useState(false);

  const [updatingItemId, setUpdatingItemId] = useState(null);

  const itemsAreEmpty = !items || items.length === 0;

  const canUseStar = true;

  const handleStarItem = (item) => {
    if (canUseStar) {
      updateItem(item.id, { featured: !item.featured });
    } else {
      alert("You must upgrade to the pro or business plan to use this feature");
    }
  };

  //a stateful boolean to toggle filtering nsfw items/links
  const [nsfwFilter, setNsfwFilter] = useState(false);

  //a function to toggle the nsfw filter
  const toggleNsfwFilter = () => {
    setNsfwFilter(!nsfwFilter);
  };

  return (
    <>
      {itemsError && (
        <Box mb={3}>
          <Alert severity="error">{itemsError.message}</Alert>
        </Box>
      )}
      <Paper className={classes.paperItems}>
        <Box
          display="flex"
          justifyContent="center"
          gridGap={"40px"}
          alignItems="center"
          padding={2}
        >
          <Typography variant="h5">My Links</Typography>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => setCreatingItem(true)}
          >
            Add Link
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent="start"
          gridGap={"40px"}
          alignItems="center"
          padding={2}
        >
          <Button
            size="small"
            style={
              nsfwFilter
                ? { background: "green", color: "white" }
                : { background: "red", color: "white" }
            }
            onClick={toggleNsfwFilter}
          >
            {nsfwFilter ? "Hide NSFW" : "Show NSFW"}
          </Button>
        </Box>
        <Divider />

        {(itemsStatus === "loading" || itemsAreEmpty) && (
          <Box py={5} px={3} align="center">
            {itemsStatus === "loading" && <CircularProgress size={32} />}

            {itemsStatus !== "loading" && itemsAreEmpty && (
              <>Nothing yet. Click the button to add your first link.</>
            )}
          </Box>
        )}

        {itemsStatus !== "loading" && items && items.length > 0 && (
          <>
            <List disablePadding={true}>
              {nsfwFilter
                ? items.map((item, index) => (
                    <ListItem
                      key={index}
                      divider={index !== items.length - 1}
                      className={item.featured ? classes.featured : ""}
                    >
                      <Box
                        sx={{
                          p: 1,
                          width: "90%",
                        }}
                      >
                        {/*Item Text Starts*/}
                        <ListItemText
                          primaryTypographyProps={{
                            style: { fontSize: "1.2rem", fontWeight: "900" },
                          }}
                        >
                          {item.name}{" "}
                          {item.sfw && (
                            <span style={{ color: "green", fontSize: "0.7em" }}>
                              (SFW)
                            </span>
                          )}
                          {!item.sfw && (
                            <span style={{ color: "red", fontSize: "0.7em" }}>
                              (NSFW)
                            </span>
                          )}
                        </ListItemText>
                        <Link
                          href={item.url}
                          target="_blank"
                          rel={"noreferrer"}
                        >
                          {item.url}
                        </Link>
                        {/*Item Text Ends*/}
                        {/*Item Secondary Action Starts*/}
                        <ListItemSecondaryAction>
                          {canUseStar && (
                            <IconButton
                              edge="end"
                              aria-label="star"
                              onClick={() => handleStarItem(item)}
                            >
                              <StarIcon
                                className={
                                  item.featured ? classes.starFeatured : ""
                                }
                              />
                            </IconButton>
                          )}
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => setUpdatingItemId(item.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                        {/*Item Secondary Action Ends*/}
                      </Box>
                      {/*Item Link Starts*/}
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener"
                        underline="none"
                      >
                        <Box
                          sx={{
                            p: 1,
                            width: "10%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        ></Box>
                      </Link>
                      {/*Item Link Ends*/}
                    </ListItem>
                  ))
                : items
                    .filter((item) => item.sfw)
                    .map((item, index) => (
                      <ListItem
                        key={index}
                        divider={index !== items.length - 1}
                        className={item.featured ? classes.featured : ""}
                      >
                        <Box
                          sx={{
                            p: 1,
                            width: "90%",
                          }}
                        >
                          {/*Item Text Starts*/}
                          <ListItemText
                            primaryTypographyProps={{
                              style: { fontSize: "1.2rem", fontWeight: "900" },
                            }}
                          >
                            {item.name}{" "}
                            {item.sfw && (
                              <span
                                style={{ color: "green", fontSize: "0.7em" }}
                              >
                                (SFW)
                              </span>
                            )}
                            {!item.sfw && (
                              <span style={{ color: "red", fontSize: "0.7em" }}>
                                (NSFW)
                              </span>
                            )}
                          </ListItemText>
                          {/*Item Text Ends*/}
                          {/*Item Secondary Action Starts*/}
                          <ListItemSecondaryAction>
                            {canUseStar && (
                              <IconButton
                                edge="end"
                                aria-label="star"
                                onClick={() => handleStarItem(item)}
                              >
                                <StarIcon
                                  className={
                                    item.featured ? classes.starFeatured : ""
                                  }
                                />
                              </IconButton>
                            )}
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => setUpdatingItemId(item.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => deleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                          <Link
                            href={item.url}
                            target="_blank"
                            rel={"noreferrer"}
                          >
                            {item.url}
                          </Link>
                          {/*Item Secondary Action Ends*/}
                        </Box>
                        {/*Item Link Starts*/}
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener"
                          underline="none"
                        >
                          <Box
                            sx={{
                              p: 1,
                              width: "10%",
                              display: "flex",
                              justifyContent: "center",

                              alignItems: "center",
                            }}
                          ></Box>
                        </Link>
                        {/*Item Link Ends*/}
                      </ListItem>
                    ))}
            </List>
          </>
        )}
      </Paper>
      {creatingItem && <EditItemModal onDone={() => setCreatingItem(false)} />}
      {updatingItemId && (
        <EditItemModal
          id={updatingItemId}
          onDone={() => setUpdatingItemId(null)}
        />
      )}
    </>
  );
}

export default DashboardItems;
