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
      <Box p={3}>
        <Typography variant="h6">No user found. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: 60, mt: 20, p: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
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
