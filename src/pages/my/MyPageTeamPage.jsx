import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Groups, Person, Business, AdminPanelSettings } from '@mui/icons-material';
import taxios from '../../utils/taxios';

export default function MyPageTeamPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await taxios.get('/team/my');
        setTeams(response.data);
      } catch (err) {
        setError('Failed to load teams');
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const getStringAvatar = (name) => {
    return {
      sx: {
        bgcolor: '#1976d2',
        color: 'white',
      },
      children: name ? name.charAt(0).toUpperCase() : '?',
    };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading teams...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Groups sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Teams
          </Typography>
        </Box>

        {teams.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Groups sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              You are not a member of any teams yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {teams.map((team) => (
              <Grid item xs={12} md={6} key={team.id}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    {/* Team Header */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Groups />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {team.name}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Business sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {team.organizationName}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Team Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Team Leader
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {team.leaderUserName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Members
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {team.userCount} member{team.userCount !== 1 ? 's' : ''}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Team Members */}
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      Team Members
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: 'center' }}>
                      {team.users.map((user) => (
                        <Avatar 
                          key={user.id}
                          {...getStringAvatar(user.name)}
                          title={`${user.name}${user.nickname ? ` (${user.nickname})` : ''}${user.id === team.leaderUserId ? ' - Leader' : ''}`}
                        />
                      ))}
                    </AvatarGroup>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
