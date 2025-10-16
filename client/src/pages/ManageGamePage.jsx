import Header from "../components/Header";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageGamePage = () => {
  const [games, setGames] = useState([]);
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(`${API_URL}games`);
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Game?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Yes, delete it",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}games/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(games.filter((game) => game._id !== id));
        Swal.fire("Deleted!", "Game has been removed.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete game.", "error");
      }
    }
  };

  const headerCellStyle = {
    fontWeight: "bold",
    color: "#ffffffff",
    textShadow: "0 0 6px #00ffff",
    backgroundColor: "#111",
    borderBottom: "2px solid #00ffff55",
  };

  const bodyCellStyle = {
    color: "#e0e0e0",
    borderBottom: "1px solid #00ffff22",
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 6, mb: 6 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#ffffffff",
            textShadow: "0 0 10px #00ffff",
            mb: 4,
          }}
        >
          🎮 Manage Games
        </Typography>

        <Paper
          sx={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #00ffff33",
            borderRadius: "14px",
            boxShadow: "0 0 20px #00ffff22",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>#</TableCell>
                <TableCell sx={headerCellStyle}>Image</TableCell>
                <TableCell sx={headerCellStyle}>Title</TableCell>
                <TableCell sx={headerCellStyle}>Genre</TableCell>
                <TableCell sx={headerCellStyle}>Platform</TableCell>
                <TableCell sx={headerCellStyle}>Description</TableCell>
                <TableCell sx={headerCellStyle} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {games.map((game, index) => (
                <TableRow
                  key={game._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#00ffff11",
                      transition: "0.3s",
                      boxShadow: "0 0 10px #00ffff44",
                    },
                  }}
                >
                  <TableCell sx={bodyCellStyle}>{index + 1}</TableCell>

                  <TableCell sx={bodyCellStyle}>
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #00ffff55",
                        }}
                      />
                    ) : (
                      <Typography color="gray" fontSize="0.9rem">
                        No Image
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold" }}>
                    {game.title}
                  </TableCell>

                  <TableCell sx={bodyCellStyle}>
                    {typeof game.genre === "string"
                      ? game.genre
                      : game.genre?.name || "N/A"}
                  </TableCell>

                  <TableCell sx={bodyCellStyle}>
                    {game.platform || "N/A"}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...bodyCellStyle,
                      maxWidth: 250,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#aaa",
                    }}
                  >
                    {game.description}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...bodyCellStyle,
                    }}
                  >
                    <Button
                      component={Link}
                      to={`/GameEditPage/${game._id}`}
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#00ffff",
                        border: "1px solid #00ffff",
                        marginRight: "5px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#00ffff",
                          color: "#000",
                          boxShadow: "0 0 10px #00ffff",
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(game._id)}
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{
                        color: "#ff4d4d",
                        border: "1px solid #ff4d4d",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#ff4d4d",
                          color: "#000",
                          boxShadow: "0 0 10px #ff4d4d",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </>
  );
};

export default ManageGamePage;
