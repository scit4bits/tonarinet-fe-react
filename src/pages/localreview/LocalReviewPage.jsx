import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
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

// Component to render circles using native Google Maps API
const CircleOverlay = ({ regions, onRegionClick, maxZoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const circles = [];
    let isVisible = true;

    const updateVisibility = () => {
      const currentZoom = map.getZoom();
      const shouldShow = currentZoom >= maxZoom;

      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        circles.forEach((circle) => {
          circle.setVisible(isVisible);
        });
      }
    };

    regions.forEach((region) => {
      const circle = new google.maps.Circle({
        strokeColor: region.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: region.color,
        fillOpacity: 0.15,
        map,
        center: region.center,
        radius: region.radius,
        clickable: true,
        visible: isVisible,
      });

      circle.addListener("click", () => {
        onRegionClick(region);
      });

      circles.push(circle);
    });

    // Listen for zoom changes
    const zoomListener = map.addListener("zoom_changed", updateVisibility);

    // Initial visibility check
    updateVisibility();

    return () => {
      circles.forEach((circle) => circle.setMap(null));
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, regions, onRegionClick, maxZoom]);

  return null;
};

// Component to render region labels with custom markers
const RegionLabels = ({ regions, onRegionClick, maxZoom = 13 }) => {
  const map = useMap();
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (!map) return;

    const updateVisibility = () => {
      const currentZoom = map.getZoom();
      setShouldShow(currentZoom >= maxZoom);
    };

    // Listen for zoom changes
    const zoomListener = map.addListener("zoom_changed", updateVisibility);

    // Initial visibility check
    updateVisibility();

    return () => {
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, maxZoom]);

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {regions.map((region) => (
        <Marker
          key={`label-${region.id}`}
          position={region.center}
          options={{
            icon: {
              url:
                "data:image/svg+xml," +
                encodeURIComponent(`
                <svg width="140" height="50" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <dropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                  </defs>
                  <rect width="140" height="50" fill="white" fill-opacity="0.9" rx="8" filter="url(#shadow)"/>
                  <rect width="140" height="50" fill="none" stroke="${region.color}" stroke-width="2" rx="8"/>
                  <text x="70" y="20" text-anchor="middle" fill="#333" font-size="12" font-weight="bold">
                    ${region.name}
                  </text>
                  <text x="70" y="35" text-anchor="middle" fill="#666" font-size="10" font-weight="bold">
                    ⭐ ${region.avgRating} (${region.reviewCount} reviews)
                  </text>
                </svg>
              `),
              anchor: { x: 70, y: 25 },
              scaledSize: { width: 140, height: 50 },
            },
          }}
          onClick={() => onRegionClick(region)}
        />
      ))}
    </>
  );
};

// Component to render markers with zoom-based visibility
const MarkerOverlay = ({ reviews, onMarkerClick, minZoom = 13 }) => {
  const map = useMap();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!map) return;

    const updateVisibility = () => {
      const currentZoom = map.getZoom();
      setShouldShow(currentZoom >= minZoom);
    };

    // Listen for zoom changes
    const zoomListener = map.addListener("zoom_changed", updateVisibility);

    // Initial visibility check
    updateVisibility();

    return () => {
      google.maps.event.removeListener(zoomListener);
    };
  }, [map, minZoom]);

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {reviews.map((place) => (
        <Marker
          key={place.id}
          position={place.position}
          onClick={() => onMarkerClick(place)}
        />
      ))}
    </>
  );
};

export default function LocalReviewPage() {
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 37.511944,
    lng: 127.058889,
  });

  // Sample circular regions
  const circularRegions = [
    {
      id: "downtown",
      name: "Downtown Seoul",
      center: { lat: 37.5665, lng: 126.978 },
      radius: 2000, // meters
      color: "#FF6B6B",
      reviewCount: 324,
      avgRating: 4.2,
    },
    {
      id: "itaewon",
      name: "Itaewon District",
      center: { lat: 37.5347, lng: 126.9947 },
      radius: 1500,
      color: "#4ECDC4",
      reviewCount: 156,
      avgRating: 4.4,
    },
    {
      id: "gangnam",
      name: "Gangnam District",
      center: { lat: 37.5172, lng: 127.0473 },
      radius: 2500,
      color: "#45B7D1",
      reviewCount: 245,
      avgRating: 4.3,
    },
  ];

  // Sample review data
  const reviews = [
    {
      id: 1,
      position: { lat: 37.515, lng: 127.06 }, // Inside Gangnam region
      name: "Gangnam Coffee House",
      rating: 4.3,
      reviewCount: 87,
      category: "Coffee",
      description: "Premium coffee in the heart of Gangnam",
    },
    {
      id: 2,
      position: { lat: 37.5665, lng: 126.978 }, // Downtown Seoul center
      name: "Seoul Plaza Restaurant",
      rating: 4.5,
      reviewCount: 156,
      category: "Restaurant",
      description: "Traditional Korean cuisine in downtown",
    },
    {
      id: 3,
      position: { lat: 37.512, lng: 127.058 }, // Close to map center, overlapping Gangnam
      name: "Central Park Cafe",
      rating: 4.1,
      reviewCount: 92,
      category: "Coffee",
      description: "Cozy cafe near the city center",
    },
    {
      id: 4,
      position: { lat: 37.5347, lng: 126.9947 }, // Itaewon center
      name: "International Food Court",
      rating: 4.4,
      reviewCount: 134,
      category: "Restaurant",
      description: "Diverse international cuisine in Itaewon",
    },
    {
      id: 5,
      position: { lat: 37.51, lng: 127.055 }, // Very close to map center
      name: "City Center Market",
      rating: 4.0,
      reviewCount: 203,
      category: "Shopping",
      description: "Local market with fresh produce and goods",
    },
  ];

  const handleMarkerClick = useCallback((place) => {
    setSelectedPlace(place);
  }, []);

  const handleRegionClick = useCallback((region) => {
    const regionPlace = {
      id: region.id,
      position: region.center,
      name: region.name,
      rating: region.avgRating,
      reviewCount: region.reviewCount,
      category: "Region",
      description: `Popular area with ${region.reviewCount} reviews`,
      isRegion: true,
    };

    setSelectedPlace(regionPlace);
    setMapCenter(region.center);
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
      <title>{t("pages.localReview.title")}</title>
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
              {/* Circular Regions using native Google Maps API */}
              <CircleOverlay
                regions={circularRegions}
                onRegionClick={handleRegionClick}
                maxZoom={12}
              />

              {/* Region Labels */}
              <RegionLabels
                regions={circularRegions}
                onRegionClick={handleRegionClick}
                maxZoom={12}
              />

              {/* Markers with zoom-based visibility */}
              <MarkerOverlay
                reviews={reviews}
                onMarkerClick={handleMarkerClick}
                minZoom={12}
              />

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
