import React, { useEffect, useRef, useState } from 'react';

// Import amCharts
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_afghanistanLow from '@amcharts/amcharts5-geodata/afghanistanLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface LocationDisplayProps {
  location: { lat: number; lng: number; province?: string };
}

// Create a fixed mapping of all Afghanistan provinces to coordinates (approximated)
const PROVINCE_COORDINATES = {
  "Badakhshan": { lat: 36.7347, lng: 70.8119 },
  "Badghis": { lat: 35.1671, lng: 63.7695 },
  "Baghlan": { lat: 35.9462, lng: 68.7100 },
  "Balkh": { lat: 36.7581, lng: 67.1015 },
  "Bamyan": { lat: 34.8100, lng: 67.8218 },
  "Daykundi": { lat: 33.7370, lng: 66.0461 },
  "Farah": { lat: 32.3747, lng: 62.1413 },
  "Faryab": { lat: 36.0799, lng: 64.9036 },
  "Ghazni": { lat: 33.5453, lng: 68.4215 },
  "Ghor": { lat: 34.0998, lng: 65.2478 },
  "Helmand": { lat: 31.5797, lng: 64.3700 },
  "Herat": { lat: 34.3530, lng: 62.2090 },
  "Jowzjan": { lat: 36.8969, lng: 65.9042 },
  "Kabul": { lat: 34.5553, lng: 69.2075 },
  "Kandahar": { lat: 31.6133, lng: 65.7100 },
  "Kapisa": { lat: 34.9809, lng: 69.6210 },
  "Khost": { lat: 33.3395, lng: 69.9348 },
  "Kunar": { lat: 34.8461, lng: 71.0973 },
  "Kunduz": { lat: 36.7290, lng: 68.8685 },
  "Laghman": { lat: 34.6898, lng: 70.1456 },
  "Logar": { lat: 34.0144, lng: 69.1933 },
  "Nangarhar": { lat: 34.1718, lng: 70.6217 },
  "Nimruz": { lat: 31.0255, lng: 62.4553 },
  "Nuristan": { lat: 35.3252, lng: 70.9072 },
  "Paktia": { lat: 33.7062, lng: 69.3851 },
  "Paktika": { lat: 32.2648, lng: 68.5249 },
  "Panjshir": { lat: 35.3125, lng: 69.9372 },
  "Parwan": { lat: 35.0095, lng: 69.1424 },
  "Samangan": { lat: 36.3120, lng: 67.9649 },
  "Sar-e Pol": { lat: 36.2151, lng: 65.9328 },
  "Takhar": { lat: 36.6701, lng: 69.4787 },
  "Uruzgan": { lat: 32.9275, lng: 66.0345 },
  "Wardak": { lat: 34.3800, lng: 68.2512 },
  "Zabul": { lat: 32.2730, lng: 67.2590 }
};

export default function LocationDisplay({ location }: LocationDisplayProps) {
  // Create refs for chart
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [provinceName, setProvinceName] = useState<string | null>(location.province || null);

  // Get province name from coordinates if not provided
  useEffect(() => {
    if (location && !location.province) {
      // Find the province by matching coordinates
      for (const [name, coords] of Object.entries(PROVINCE_COORDINATES)) {
        if (Math.abs(coords.lat - location.lat) < 0.01 && Math.abs(coords.lng - location.lng) < 0.01) {
          setProvinceName(name);
          return;
        }
      }
      setProvinceName(null);
    }
  }, [location]);

  // Initialize chart on component mount
  useEffect(() => {
    // Skip if chart already exists or container is not ready
    if (chartRef.current || !chartDivRef.current) return;

    // Add a small delay to ensure the DOM is fully ready
    const timer = setTimeout(() => {
      try {
        // Create root element
        const root = am5.Root.new(chartDivRef.current!);

        // Set themes
        root.setThemes([am5themes_Animated.new(root)]);

        // Create the map chart
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            projection: am5map.geoMercator(),
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            maxZoomLevel: 64
          })
        );

        // Create polygon series for provinces
        const provinceSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_afghanistanLow
          })
        );

        // Configure provinces appearance
        provinceSeries.mapPolygons.template.setAll({
          tooltipText: "{name}",
          interactive: true,
          fill: am5.color(0x67B7DC),
          stroke: am5.color(0xFFFFFF),
          strokeWidth: 1
        });

        // Create state for selected province
        provinceSeries.mapPolygons.template.states.create("selected", {
          fill: am5.color(0xFF5733)
        });

        // Create point series for marker
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Add a marker point if location is provided
        if (location) {
          pointSeries.data.push({
            geometry: { type: "Point", coordinates: [location.lng, location.lat] }
          });

          // Highlight the matching province if location is provided
          if (location) {
            // Find the province by matching coordinates
            for (const [provinceName, coords] of Object.entries(PROVINCE_COORDINATES)) {
              if (Math.abs(coords.lat - location.lat) < 0.01 && Math.abs(coords.lng - location.lng) < 0.01) {
                // Find and highlight the province polygon
                provinceSeries.mapPolygons.each(function(polygon: any) {
                  const dataItem = polygon.dataItem;
                  if (dataItem && dataItem.dataContext && dataItem.dataContext.name === provinceName) {
                    polygon.states.applyAnimate("selected");
                  }
                });
                break;
              }
            }
          }
        }

        // Configure the marker appearance
        pointSeries.bullets.push(function() {
          const circle = am5.Circle.new(root, {
            radius: 7,
            tooltipText: "Location",
            fill: am5.color(0xFF5733),
            stroke: am5.color(0xFFFFFF),
            strokeWidth: 2
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        // Zoom to marker if location is provided, otherwise zoom to Afghanistan center
        if (location) {
          chart.zoomToGeoPoint({ longitude: location.lng, latitude: location.lat }, 4);
        } else {
          chart.zoomToGeoPoint({ longitude: 67.709953, latitude: 33.93911 }, 3);
        }

        // Set chart reference
        chartRef.current = root;
        setIsMapReady(true);

        // Force layout updates
        root.container.children.each((child) => {
          if (child.states) {
            child.states.create("default", {});
            child.states.apply("default");
          }
        });

        // Force a resize to ensure the chart is properly sized
        setTimeout(() => {
          root.resize();
        }, 200);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, []);

  // Update marker position when location changes
  useEffect(() => {
    if (chartRef.current && isMapReady && location) {
      const chart = chartRef.current.container.children.getIndex(0) as am5map.MapChart;

      // Find point series
      const pointSeries = chart.series.values.find(
        series => series instanceof am5map.MapPointSeries
      ) as am5map.MapPointSeries;

      if (pointSeries) {
        // Update data
        pointSeries.data.setAll([{
          geometry: { type: "Point", coordinates: [location.lng, location.lat] }
        }]);

        // Zoom to point
        chart.zoomToGeoPoint({ longitude: location.lng, latitude: location.lat }, 4);

        // Reset all provinces to default state
        const provinceSeries = chart.series.values.find(
          series => series instanceof am5map.MapPolygonSeries
        ) as am5map.MapPolygonSeries;

        if (provinceSeries) {
          provinceSeries.mapPolygons.each(function(polygon: any) {
            polygon.states.applyAnimate("default");
          });

          // Highlight the matching province
          if (provinceName) {
            provinceSeries.mapPolygons.each(function(polygon: any) {
              const dataItem = polygon.dataItem;
              if (dataItem && dataItem.dataContext && dataItem.dataContext.name === provinceName) {
                polygon.states.applyAnimate("selected");
              }
            });
          }
        }
      }
    }
  }, [location, isMapReady, provinceName]);

  return (
    <div className="w-full">
      <div
        className="rounded-md overflow-hidden border border-gray-300 h-[400px]"
        style={{ background: "#f5f5f5" }}
      >
        {!isMapReady && (
          <div className="flex items-center justify-center h-full w-full">
            <p>Loading map of Afghanistan...</p>
          </div>
        )}
        <div
          ref={chartDivRef}
          className="h-full w-full"
          style={{
            height: '100%',
            width: '100%',
            display: 'block'
          }}
        />
      </div>

      <div className="mt-2 text-sm font-mono text-center">
        {location ?
          <span>
            {provinceName ? `${provinceName} Province: ` : ''}
            Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
          </span>
          : 'No location data'
        }
      </div>
    </div>
  );
}
