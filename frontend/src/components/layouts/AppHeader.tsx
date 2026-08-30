import { useAuth } from "@/providers/AuthProvider";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import { paths } from "../routes/paths";
import { Link, useLocation } from "react-router"; // useLocationを追加

const navItems = [
  { name: "ダッシュボード", link: paths.dashboard },
  { name: "家計管理", link: paths.houseHoldBudget },
];

export const AppHeader = () => {
  const { currentUser } = useAuth();
  const location = useLocation(); // 現在のパスを取得

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
          <Box>
            {navItems.map((item) => {
              // 現在のパスと一致しているかチェック
              const isActive = location.pathname === item.link;

              return (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.link}
                  disableRipple={false}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    mx: 1,
                    borderRadius: 0,
                    // sxプロパティ内で動的にアンダーラインを切替
                    borderBottom: isActive
                      ? "3px solid #fff"
                      : "2px solid transparent",
                    "&:hover": {
                      borderBottom: "2px solid rgba(255, 255, 255, 0.7)",
                    },
                  }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
