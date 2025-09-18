import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import {
  fetchNearbyLiveReports,
  fetchNearbyRegions,
  searchPlacesNearLocation,
} from "../../utils/mapApi";

import { ExpandLess, ExpandMore, LocationOn } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { createLiveReport, likeLiveReport } from "../../utils/liveReport";
import {
  createTownReview,
  fetchTownReviewsByRegion,
} from "../../utils/townReview";
import { TranslatableText } from "../../components/TranslatableText";

// Component to track map center and enable API calls with current center
const MapCenterTracker = ({ onCenterChange, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Notify parent that map is ready
    onMapReady && onMapReady(map);

    // Get initial center
    const initialCenter = map.getCenter();
    if (initialCenter && onCenterChange) {
      onCenterChange({
        lat: initialCenter.lat(),
        lng: initialCenter.lng(),
      });
    }

    // Listen for drag end events
    const dragEndListener = map.addListener("dragend", () => {
      const center = map.getCenter();
      if (center && onCenterChange) {
        onCenterChange({
          lat: center.lat(),
          lng: center.lng(),
        });
      }
    });

    return () => {
      google.maps.event.removeListener(dragEndListener);
    };
  }, [map, onCenterChange, onMapReady]);

  return null;
};

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
        strokeColor: "#ff7f50",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#ffc7b3",
        fillOpacity: 0.15,
        map,
        center: {
          lat: region.latitude,
          lng: region.longitude,
        },
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
          position={{
            lat: region.latitude,
            lng: region.longitude,
          }}
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
                  <rect width="140" height="50" fill="none" stroke="${
                    region.color
                  }" stroke-width="2" rx="8"/>
                  <text x="70" y="20" text-anchor="middle" fill="#333" font-size="12" font-weight="bold">
                    ${region.category4}
                  </text>
                  <text x="70" y="35" text-anchor="middle" fill="#666" font-size="10" font-weight="bold">
                    ⭐ ${region.averageReviewScore || "0.0"}
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
const MarkerOverlay = ({ reports, onMarkerClick, minZoom = 13 }) => {
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
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={{
            lat: report.latitude,
            lng: report.longitude,
          }}
          onClick={() => onMarkerClick(report)}
        />
      ))}
    </>
  );
};

export default function LocalReviewPage() {
  const { t } = useTranslation();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTownReviewActive, setIsTownReviewActive] = useState(true);
  const [isLiveReportActive, setIsLiveReportActive] = useState(true);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.511944,
    lng: 127.058889,
  });
  const [currentMapCenter, setCurrentMapCenter] = useState(mapCenter);
  const [mapInstance, setMapInstance] = useState(null);
  const [nearbyData, setNearbyData] = useState({
    liveReports: [],
    regions: [],
    isLoading: false,
    error: null,
  });

  // Town reviews state
  const [townReviews, setTownReviews] = useState([]);
  const [loadingTownReviews, setLoadingTownReviews] = useState(false);
  const [expandedReview, setExpandedReview] = useState(null);

  // Dialog state for review form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    content: "",
    transportation: 0,
    safety: 0,
    infra: 0,
    population: 0,
    education: 0,
  });

  // Function to fetch town reviews for a region
  const fetchTownReviews = useCallback(async (regionId) => {
    setLoadingTownReviews(true);
    try {
      const reviews = await fetchTownReviewsByRegion(regionId);
      setTownReviews(reviews || []);
    } catch (error) {
      console.error("Error fetching town reviews:", error);
      setTownReviews([]);
    } finally {
      setLoadingTownReviews(false);
    }
  }, []);

  // Handle map center changes
  const handleCenterChange = useCallback((newCenter) => {
    console.log(newCenter);
    setCurrentMapCenter(newCenter);
  }, []);

  // Handle when map instance is ready
  const handleMapReady = useCallback((map) => {
    setMapInstance(map);
  }, []);

  // Function to get current map center and make API call
  useEffect(() => {
    const fetchData = async () => {
      if (!currentMapCenter) return;

      setNearbyData((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Fetch nearby regions using current map center
        const regionsData = await fetchNearbyRegions(currentMapCenter, 0.08);
        console.log("Nearby regions:", regionsData);

        // Fetch reviews near current location
        const liveReportsData = await fetchNearbyLiveReports(
          currentMapCenter,
          0.08
        );
        console.log("Nearby live reports:", liveReportsData);

        setNearbyData({
          liveReports: liveReportsData || [],
          regions: regionsData || [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data for current center:", error);
        setNearbyData((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || "Failed to fetch data",
        }));
      }
    };

    fetchData();
  }, [currentMapCenter]);

  // Function to manually get current center from map instance
  const getCurrentCenterFromMap = useCallback(() => {
    if (!mapInstance) return null;

    const center = mapInstance.getCenter();
    return center
      ? {
          lat: center.lat(),
          lng: center.lng(),
        }
      : null;
  }, [mapInstance]);

  const handleMarkerClick = useCallback(
    (report) => {
      // Ensure live reports have the correct category
      const updatedPlace = {
        ...report,
        category: report.category || "liveReport",
      };

      setSelectedPlace(updatedPlace);
      setTownReviews([]); // Clear town reviews when selecting a different place
      setExpandedReview(null);

      // Move map center to the clicked place
      const newCenter = {
        lat: report.latitude,
        lng: report.longitude,
      };
      setMapCenter(newCenter);

      // If map instance is available, pan to the location smoothly
      if (mapInstance) {
        mapInstance.panTo(newCenter);
      }
    },
    [mapInstance]
  );

  const handleRegionClick = useCallback(
    (region) => {
      const regionPlace = {
        id: region.id,
        position: {
          lat: region.latitude,
          lng: region.longitude,
        },
        latitude: region.latitude,
        longitude: region.longitude,
        name: region.category4,
        rating: region.avgRating,
        reviewCount: region.reviewCount,
        category: "Region",
        contents: "",
        isRegion: true,
      };

      setSelectedPlace(regionPlace);
      setMapCenter(region.center);

      // Fetch town reviews for this region
      fetchTownReviews(region.id);
    },
    [fetchTownReviews]
  );

  const handleSearch = async () => {
    // Get current map center for the search
    const center = getCurrentCenterFromMap() || currentMapCenter;

    console.log("Searching for:", searchQuery, "at center:", center);

    if (!searchQuery.trim()) {
      console.warn("Search query is empty");
      return;
    }

    try {
      // Use the utility function for searching places
      const results = await searchPlacesNearLocation(
        searchQuery,
        center,
        10000
      );
      console.log("Search results:", results);

      // Handle search results here - you could update state to show results
      // For example: setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;

    // Create a new review location
    const newLiveReport = {
      id: Date.now(), // temporary ID
      position: { lat, lng },
      latitude: lat,
      longitude: lng,
      name: t("common.newReport"),
      rating: 0,
      reviewCount: 0,
      category: "liveReport",
      contents: t("common.clickToReport"),
      isNewReview: true,
    };

    setSelectedPlace(newLiveReport);
  }, []);

  // Handle dialog functions
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setReviewForm({
      content: "",
      transportation: 0,
      safety: 0,
      infra: 0,
      population: 0,
      education: 0,
    });
  };

  const handleFormChange = (field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitReview = async () => {
    if (selectedPlace.category === "Region") {
      // Submit town review
      const payload = {
        regionId: selectedPlace.id,
        contents: reviewForm.content,
        transportation: reviewForm.transportation || 0,
        safety: reviewForm.safety || 0,
        infra: reviewForm.infra || 0,
        population: reviewForm.population || 0,
        education: reviewForm.education || 0,
      };

      try {
        await createTownReview(payload);
        // Refresh town reviews
        await fetchTownReviews(selectedPlace.id);

        // refresh nearby data
        const regionsData = await fetchNearbyRegions(currentMapCenter, 0.08);
        setNearbyData((prev) => ({
          ...prev,
          regions: regionsData || [],
        }));
        handleCloseDialog();
      } catch (error) {
        console.error("Error submitting town review:", error);
      }
    } else {
      // Submit live report (existing functionality)
      const payload = {
        contents: reviewForm.content,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      };

      try {
        const response = await createLiveReport(payload);
        setSelectedPlace({
          ...response,
          category: "liveReport",
          position: { lat: response.latitude, lng: response.longitude },
          name: `Live Report #${response.id}`,
        });

        const liveReportsData = await fetchNearbyLiveReports(
          currentMapCenter,
          0.08
        );

        setNearbyData((prev) => ({
          ...prev,
          liveReports: liveReportsData,
        }));

        handleCloseDialog();
      } catch (error) {
        console.error("Error submitting live report:", error);
      }
    }
  };

  const handleLikeLiveReport = async () => {
    if (selectedPlace.category === "liveReport" && selectedPlace.id) {
      try {
        await likeLiveReport(selectedPlace.id);

        // Refresh live reports
        const liveReportsData = await fetchNearbyLiveReports(
          currentMapCenter,
          0.08
        );

        setNearbyData((prev) => ({
          ...prev,
          liveReports: liveReportsData,
        }));

        // Update selected place with new like count if available
        const updatedReport = liveReportsData.find(
          (report) => report.id === selectedPlace.id
        );
        if (updatedReport) {
          setSelectedPlace({
            ...selectedPlace,
            likeCount: updatedReport.likeCount,
          });
        }
      } catch (error) {
        console.error("Error liking live report:", error);
      }
    }
  };

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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={t("common.townReview")}
            variant={isTownReviewActive ? "filled" : "outlined"}
            clickable
            color="primary"
            onClick={() => setIsTownReviewActive(!isTownReviewActive)}
          />
          <Chip
            label={t("common.liveReport")}
            variant={isLiveReportActive ? "filled" : "outlined"}
            clickable
            color="primary"
            onClick={() => setIsLiveReportActive(!isLiveReportActive)}
          />
          {/* <Chip label="Shopping" variant="outlined" clickable color="primary" /> */}
        </Box>
        {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder={t("common.searchPlacesPlaceholder")}
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
            {t("common.search")}
          </Button>
        </Box> */}
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
                {selectedPlace.name || `Live Report #${selectedPlace.id}`}
                {selectedPlace.isNewReview && (
                  <Chip
                    label={t("common.new")}
                    size="small"
                    color="success"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              {selectedPlace.countryCode && (
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
              )}
              <TranslatableText>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedPlace.contents}
                </Typography>
              </TranslatableText>
              {selectedPlace.createdByName && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("common.reportedBy")}: {selectedPlace.createdByName}
                </Typography>
              )}
              {!selectedPlace.isRegion && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("common.coordinates")} {selectedPlace.latitude},{" "}
                  {selectedPlace.longitude}
                </Typography>
              )}

              {/* Show like count for live reports */}
              {selectedPlace.category === "liveReport" &&
                selectedPlace.likeCount !== undefined && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    👍 {selectedPlace.likeCount} {t("common.likes")}
                  </Typography>
                )}

              {/* Show town reviews if this is a region */}
              {selectedPlace.category === "Region" && (
                <Box sx={{ mb: 2, flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {t("common.townReviews")}
                  </Typography>
                  {loadingTownReviews ? (
                    <Typography variant="body2" color="text.secondary">
                      {t("common.loadingReviews")}
                    </Typography>
                  ) : townReviews.length > 0 ? (
                    <List>
                      {townReviews.map((review) => (
                        <React.Fragment key={review.id}>
                          <ListItem
                            sx={{ px: 0 }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  setExpandedReview(
                                    expandedReview === review.id
                                      ? null
                                      : review.id
                                  )
                                }
                              >
                                {expandedReview === review.id ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="subtitle2">
                                    {t("common.reviewNumber")}
                                    {review.id}
                                  </Typography>
                                  <Rating
                                    size="small"
                                    value={
                                      (review.transportation +
                                        review.safety +
                                        review.infra +
                                        review.population +
                                        review.education) /
                                      5
                                    }
                                    precision={0.1}
                                    readOnly
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    (
                                    {(
                                      (review.transportation +
                                        review.safety +
                                        review.infra +
                                        review.population +
                                        review.education) /
                                      5
                                    ).toFixed(1)}
                                    /5)
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                review.contents?.substring(0, 100) +
                                (review.contents?.length > 100 ? "..." : "")
                              }
                            />
                          </ListItem>
                          <Collapse
                            in={expandedReview === review.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                              <Typography variant="body2" paragraph>
                                {review.contents}
                              </Typography>
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 1,
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t("common.reviewTransportation")} (
                                    {review.transportation}/5)
                                  </Typography>
                                  <Rating
                                    value={review.transportation}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t("common.reviewSafety")} ({review.safety}
                                    /5)
                                  </Typography>
                                  <Rating
                                    value={review.safety}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t("common.reviewInfrastructure")} (
                                    {review.infra}/5)
                                  </Typography>
                                  <Rating
                                    value={review.infra}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t("common.reviewPopulation")} (
                                    {review.population}/5)
                                  </Typography>
                                  <Rating
                                    value={review.population}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                                <Box sx={{ gridColumn: "span 2" }}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {t("common.reviewEducation")} (
                                    {review.education}/5)
                                  </Typography>
                                  <Rating
                                    value={review.education}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("common.reportedBy")}: {review.createdByName}{" "}
                              </Typography>
                            </Box>
                          </Collapse>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t("common.noReviewsAvailable")}
                    </Typography>
                  )}
                </Box>
              )}
              {selectedPlace.isNewReview ? (
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: "auto" }}
                  fullWidth
                  onClick={handleOpenDialog}
                >
                  {t("common.writeReview")}
                </Button>
              ) : selectedPlace.category === "Region" ? (
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: "auto" }}
                  fullWidth
                  onClick={handleOpenDialog}
                >
                  {t("common.addNewTownReview")}
                </Button>
              ) : selectedPlace.category === "liveReport" ? (
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: "auto" }}
                  fullWidth
                  onClick={handleLikeLiveReport}
                >
                  {t("common.likeThisReport")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LocationOn />}
                  sx={{ mt: "auto" }}
                  fullWidth
                >
                  {t("common.viewFullDetails")}
                </Button>
              )}
              <Button
                variant="outlined"
                size="medium"
                sx={{ mt: 1 }}
                fullWidth
                onClick={() => {
                  setSelectedPlace(null);
                  setTownReviews([]);
                  setExpandedReview(null);
                }}
              >
                {t("common.clearSelection")}
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              <LocationOn sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                {nearbyData.liveReports.length > 0
                  ? t("common.nearbyLiveReports")
                  : t("common.selectLocation")}
              </Typography>

              {nearbyData.liveReports.length > 0 ? (
                <Box sx={{ textAlign: "left", mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {t("common.foundLiveReportsNearby", {
                      count: nearbyData.liveReports.length,
                    })}
                  </Typography>
                  {nearbyData.liveReports.map((report, index) => (
                    <Card
                      key={index}
                      sx={{ mb: 1, cursor: "pointer" }}
                      onClick={() => handleMarkerClick(report)}
                    >
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {`${t("common.liveReportPrefix")} ${report.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ⭐ {report.likeCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  {nearbyData.liveReports.length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      + {nearbyData.liveReports.length - 5}{" "}
                      {t("common.moreReports")}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2">
                  {t("common.clickMarkerInstruction")}
                  <br />
                  {t("common.zoomInMap")}
                </Typography>
              )}
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
              {/* Track map center changes */}
              <MapCenterTracker
                onCenterChange={handleCenterChange}
                onMapReady={handleMapReady}
              />

              {isTownReviewActive && (
                <>
                  {/* Circular Regions using native Google Maps API */}
                  <CircleOverlay
                    regions={nearbyData.regions}
                    onRegionClick={handleRegionClick}
                    maxZoom={12}
                  />

                  {/* Region Labels */}
                  <RegionLabels
                    regions={nearbyData.regions}
                    onRegionClick={handleRegionClick}
                    maxZoom={12}
                  />
                </>
              )}

              {isLiveReportActive && (
                <MarkerOverlay
                  reports={
                    nearbyData.liveReports.length > 0
                      ? nearbyData.liveReports
                      : []
                  }
                  onMarkerClick={handleMarkerClick}
                  minZoom={12}
                />
              )}
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

      {/* Review Form Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlace?.category === "Region"
            ? t("common.addTownReview")
            : t("common.writeReview")}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {selectedPlace?.category === "Region" && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t("common.rateRegionInstruction")}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {t("common.reviewTransportation")}:{" "}
                    {reviewForm.transportation}
                  </Typography>
                  <Slider
                    value={reviewForm.transportation}
                    onChange={(e, value) =>
                      handleFormChange("transportation", value)
                    }
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {t("common.reviewSafety")}: {reviewForm.safety}
                  </Typography>
                  <Slider
                    value={reviewForm.safety}
                    onChange={(e, value) => handleFormChange("safety", value)}
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {t("common.reviewInfrastructure")}: {reviewForm.infra}
                  </Typography>
                  <Slider
                    value={reviewForm.infra}
                    onChange={(e, value) => handleFormChange("infra", value)}
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {t("common.reviewPopulation")}: {reviewForm.population}
                  </Typography>
                  <Slider
                    value={reviewForm.population}
                    onChange={(e, value) =>
                      handleFormChange("population", value)
                    }
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {t("common.reviewEducation")}: {reviewForm.education}
                  </Typography>
                  <Slider
                    value={reviewForm.education}
                    onChange={(e, value) =>
                      handleFormChange("education", value)
                    }
                    min={0}
                    max={5}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>
              </>
            )}

            <TextField
              label={t("common.reviewContent")}
              multiline
              rows={6}
              fullWidth
              value={reviewForm.content}
              onChange={(e) => handleFormChange("content", e.target.value)}
              placeholder={
                selectedPlace?.category === "Region"
                  ? t("common.shareTownThoughts")
                  : t("common.shareExperience")
              }
              autoFocus={selectedPlace?.category !== "Region"}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!reviewForm.content.trim()}
          >
            {selectedPlace?.category === "Region"
              ? t("common.submitTownReview")
              : t("common.submitReview")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
