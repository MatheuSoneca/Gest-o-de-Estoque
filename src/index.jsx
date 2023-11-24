import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  SpeedDial,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState, Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useLocalStorage, useToggle } from "react-use";

const useUniqueID = () => {
  const [ID, setID] = useLocalStorage("useUniqueID", 0);

  return () => {
    console.log(ID);
    const currentID = ID;
    setID(ID + 1);
    return currentID;
  };
};

const useCurrentDialog = () => {
  const [currentDialog, setCurrentDialog] = useState();

  const close = () => {
    setCurrentDialog(undefined);
  };

  const openNewDialog = () => {
    setCurrentDialog("new");
  };

  const openEditDialog = (id) => {
    setCurrentDialog(id);
  };

  const isOpen = (id) => {
    if (id === undefined) return currentDialog === "new";
    return currentDialog === id;
  };

  return { close, openNewDialog, openEditDialog, isOpen };
};

function InvetoryInputDialog({ open, initialValues = {}, onClose, onSave }) {
  const [name, setName] = useState(initialValues.name || "");
  const [amount, setAmount] = useState(initialValues.amount || 0);
  const [description, setDescription] = useState(
    initialValues.description || ""
  );

  const clearForm = () => {
    setName(initialValues.name || "");
    setAmount(initialValues.amount || 0);
    setDescription(initialValues.description || "");
  };

  const closeDialog = () => {
    clearForm();
    onClose();
  };

  const saveInvetoryInput = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Insumo</DialogTitle>
      <DialogContent>
        <Stack spacing={3} style={{ marginTop: "10px" }}>
          <TextField
            label="Insumo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Quantitativo"
            value={amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <TextField
            label="Observação"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => saveInvetoryInput({ name, amount, description })}
        >
          Salvar
        </Button>
        <Button onClick={closeDialog}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

function App() {
  const { isOpen, openNewDialog, openEditDialog, close } = useCurrentDialog();
  const [invetoryInputs, setInvetoryInputs] = useLocalStorage(
    "invetoryInputs",
    []
  );
  const generateUniqueID = useUniqueID();

  const createInvetoryInputRemover = (invetoryInputId) => () => {
    setInvetoryInputs(
      invetoryInputs.filter(
        (invetoryInput) => invetoryInput.id !== invetoryInputId
      )
    );
  };

  const saveInvetoryInput = ({ name, amount, description }) => {
    setInvetoryInputs([
      ...invetoryInputs,
      { id: generateUniqueID(), name, amount, description },
    ]);
  };

  const createInvetoryInputEditor =
    (id) =>
    ({ name, amount, description }) => {
      setInvetoryInputs(
        invetoryInputs.map((invetoryInput) => {
          if (invetoryInput.id !== id) return invetoryInput;
          return {
            ...invetoryInput,
            name,
            amount,
            description,
          };
        })
      );
    };

  return (
    <>
      <div
        style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}
      >
        <Paper
          style={{
            backgroundColor: "#74d9fc",
            width: "100vw",
            height: "10vh",
            borderRadius: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Typography variant="h4">Estoque</Typography>
        </Paper>
        <Box
          style={{
            width: "100vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "50px",
            boxSizing: "border-box",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {invetoryInputs.map((invetoryInput) => (
            <Fragment key={invetoryInput.id}>
              <Box
                style={{
                  color: "black",
                  width: "70vw",
                }}
              >
                <Box style={{ justifyContent: "center", display: "flex" }}>
                  <Box style={{ width: "100%" }}>
                    <Box
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        style={{
                          backgroundColor: "#74d9fc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "14px",
                          padding: "3px",
                          minWidth: "25px",
                          marginRight: "10px",
                        }}
                      >
                        <Typography variant="body1">
                          {invetoryInput.amount}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {invetoryInput.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {invetoryInput.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Box style={{ display: "flex" }}>
                      <IconButton
                        onClick={() => openEditDialog(invetoryInput.id)}
                        style={{
                          backgroundColor: "#74d9fc",
                          marginRight: "10px",
                        }}
                      >
                        <EditIcon style={{ color: "white" }} />
                      </IconButton>
                      <IconButton
                        style={{ backgroundColor: "#74d9fc" }}
                        onClick={createInvetoryInputRemover(invetoryInput.id)}
                      >
                        <ClearIcon style={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Divider style={{ marginBottom: "10px", marginTop: "5px" }} />
              </Box>
              <InvetoryInputDialog
                initialValues={invetoryInput}
                open={isOpen(invetoryInput.id)}
                onClose={close}
                onSave={createInvetoryInputEditor(invetoryInput.id)}
              />
            </Fragment>
          ))}
        </Box>
      </div>
      <SpeedDial
        onClick={openNewDialog}
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<AddIcon />}
      />
      <InvetoryInputDialog
        open={isOpen()}
        onClose={close}
        onSave={saveInvetoryInput}
      />
    </>
  );
}

export default App;
