import { useAuth } from "@/providers/AuthProvider";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";

export const AppHeader = () => {
  const { currentUser } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton color="inherit" sx={{ mr: 0.5 }}>
            <SavingsIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Asset Bags
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
