import React, { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { Search, LocationOn } from "@mui/icons-material";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Rating,
  Chip,
} from "@mui/material";

export default function LocalReviewPage() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });

  // Sample review data
  const reviews = [
    {
      id: 1,
      position: { lat: 37.7749, lng: -122.4194 },
      name: "Local Coffee Shop",
      rating: 4.5,
      reviewCount: 128,
      category: "Coffee",
      description: "Great coffee and atmosphere",
    },
    {
      id: 2,
      position: { lat: 37.7849, lng: -122.4094 },
      name: "Pizza Corner",
      rating: 4.2,
      reviewCount: 89,
      category: "Restaurant",
      description: "Authentic Italian pizza",
    },
  ];

  const handleMarkerClick = useCallback((place) => {
    setSelectedPlace(place);
  }, []);

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;

    // Create a new review location
    const newPlace = {
      id: Date.now(), // temporary ID
      position: { lat, lng },
      name: "New Location",
      rating: 0,
      reviewCount: 0,
      category: "New Review",
      description: "Click to add your review here",
      isNewReview: true,
    };

    setSelectedPlace(newPlace);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "80vh",
        width: "100%",
        padding: "10px",
      }}
    >
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip label="Coffee" variant="outlined" clickable color="primary" />
          <Chip
            label="Restaurant"
            variant="outlined"
            clickable
            color="primary"
          />
          <Chip label="Shopping" variant="outlined" clickable color="primary" />
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<Search />}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area with Sidebar and Map */}
      <Box sx={{ display: "flex", flexGrow: 1, gap: 2, overflow: "hidden" }}>
        {/* Sidebar */}
        <Paper
          elevation={2}
          sx={{
            width: 350,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedPlace ? (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedPlace.name}
                {selectedPlace.isNewReview && (
                  <Chip
                    label="New"
                    size="small"
                    color="success"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating
                  value={selectedPlace.rating}
                  precision={0.1}
                  readOnly={!selectedPlace.isNewReview}
                  size="medium"
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  ({selectedPlace.reviewCount} reviews)
                </Typography>
              </Box>

              <Chip
                label={selectedPlace.category}
                size="medium"
                color="primary"
                sx={{ mb: 2, alignSelf: "flex-start" }}
              />

              <Typography variant="body1" color="text.secondary" paragraph>
                {selectedPlace.description}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Coordinates: {selectedPlace.position.lat.toFixed(6)},{" "}
                {selectedPlace.position.lng.toFixed(6)}
              </Typography>

              {selectedPlace.isNewReview ? (
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: "auto" }}
                  fullWidth
                  onClick={() => {
                    // Handle write review action
                    console.log("Write review for:", selectedPlace.position);
                  }}
                >
                  Write Review
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LocationOn />}
                  sx={{ mt: "auto" }}
                  fullWidth
                >
                  View Full Details
                </Button>
              )}

              <Button
                variant="outlined"
                size="medium"
                sx={{ mt: 1 }}
                fullWidth
                onClick={() => setSelectedPlace(null)}
              >
                Clear Selection
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              <LocationOn sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                Select a Location
              </Typography>
              <Typography variant="body2">
                Click on a marker or anywhere on the map to select a location
                and write a review.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Map Container */}
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              style={{ width: "100%", height: "100%" }}
              defaultCenter={mapCenter}
              defaultZoom={13}
              gestureHandling={"greedy"}
              disableDefaultUI={false}
              onClick={handleMapClick}
            >
              {reviews.map((place) => (
                <Marker
                  key={place.id}
                  position={place.position}
                  onClick={() => handleMarkerClick(place)}
                />
              ))}

              {selectedPlace && selectedPlace.isNewReview && (
                <Marker
                  position={selectedPlace.position}
                  onClick={() => handleMarkerClick(selectedPlace)}
                />
              )}
            </Map>
          </APIProvider>
        </Box>
      </Box>
    </Box>
  );
}
