import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchProps = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  placeholder?: string;
};

function SearchComponent({ searchTerm, setSearchTerm, placeholder = "Search..." }: SearchProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchComponent;


