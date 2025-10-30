import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { getCurrentUser } from "../../services/authService";

export default function AccountDetailPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setUser(current);
  }, []);

  if (!user) {
    return (
      <Box p={{ xs: 2, sm: 3 }}>
        <Typography variant="h6">No user found. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", sm: "center" },
        minHeight: { sm: "calc(100vh - 60px)" },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: 600,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Account Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <TextField
            label="Name"
            value={user.name || ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Email"
            value={user.email || ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Role"
            value={user.role || ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Stack>
      </Paper>
    </Box>
  );
}
