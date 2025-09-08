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
import { Celebration, Person, Star, Group } from '@mui/icons-material';
import taxios from '../../utils/taxios';

export default function MyPagePartyPage() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoading(true);
        const response = await taxios.get('/party/my');
        setParties(response.data);
      } catch (err) {
        setError('Failed to load parties');
        console.error('Error fetching parties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const getStringAvatar = (name) => {
    return {
      sx: {
        bgcolor: '#9c27b0',
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
          Loading parties...
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
          <Celebration sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Parties
          </Typography>
        </Box>

        {parties.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Celebration sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              You are not a member of any parties yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {parties.map((party) => (
              <Grid item xs={12} md={6} key={party.id}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    {/* Party Header */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <Celebration />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {party.name}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Party Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Party Leader
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {party.leaderUserName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Members
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Group sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {party.userCount} member{party.userCount !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Party Members */}
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      Party Members
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                      {party.users.map((user) => (
                        <Avatar 
                          key={user.id}
                          {...getStringAvatar(user.name)}
                          title={`${user.name}${user.nickname ? ` (${user.nickname})` : ''}${user.id === party.leaderUserId ? ' - Leader' : ''}`}
                        />
                      ))}
                    </AvatarGroup>

                    {/* Member Roles */}
                    {party.users.some(user => user.role) && (
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Member Roles
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {party.users
                            .filter(user => user.role)
                            .slice(0, 3)
                            .map((user) => (
                              <Chip
                                key={user.id}
                                label={`${user.name}: ${user.role}`}
                                size="small"
                                variant="outlined"
                                color={user.id === party.leaderUserId ? 'primary' : 'default'}
                              />
                            ))}
                          {party.users.filter(user => user.role).length > 3 && (
                            <Chip
                              label={`+${party.users.filter(user => user.role).length - 3} more`}
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
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
