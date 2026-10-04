import "./App.css";
import { AuthProvider } from "./providers/AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ja";
import Routes from "./routes/Routes";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
