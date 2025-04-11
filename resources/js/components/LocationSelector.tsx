import React, { useState, useEffect, useRef } from 'react';

// Import amCharts
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_afghanistanLow from '@amcharts/amcharts5-geodata/afghanistanLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface LocationSelectorProps {
  value?: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number } | null) => void;
}

// Create a fixed mapping of some provinces to coordinates (approximated)
const PROVINCE_COORDINATES = {
  "Kabul": { lat: 34.5553, lng: 69.2075 },
  "Herat": { lat: 34.3530, lng: 62.2090 },
  "Kandahar": { lat: 31.6133, lng: 65.7100 },
  "Balkh": { lat: 36.7581, lng: 67.1015 },
  "Nangarhar": { lat: 34.1718, lng: 70.6217 }
};

// Default to center of Afghanistan if province not found
const DEFAULT_COORDINATE = { lat: 33.9391, lng: 67.7100 };

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  // Create refs for chart
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);

  // State to track the selected position
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize chart on component mount
  useEffect(() => {
    // Skip if chart already exists or container not ready
    if (chartRef.current || !chartDivRef.current) return;

    // Add a small delay to ensure the DOM is fully ready
    const timer = setTimeout(() => {
      try {
        // Create root element with explicit dimensions
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

        // Create polygon series for Afghanistan provinces
        const provinceSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_afghanistanLow,
            fill: am5.color(0x67B7DC),
            stroke: am5.color(0xFFFFFF)
          })
        );

        // Make provinces interactive
        provinceSeries.mapPolygons.template.setAll({
          tooltipText: "{name}",
          interactive: true,
          fill: am5.color(0x67B7DC),
          stroke: am5.color(0xFFFFFF),
          strokeWidth: 1
        });

        // Change fill color on hover
        provinceSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0x4A89DC)
        });

        // Add click events on provinces using any to bypass TypeScript strictness
        provinceSeries.mapPolygons.template.events.on("click", function(ev) {
          // Use any to bypass TypeScript strict typing
          const target = ev.target as any;
          const dataItem = target.dataItem as any;

          if (dataItem && dataItem.dataContext) {
            // Try to get province name
            const provinceName = dataItem.dataContext.name;

            // Pick a coordinate based on the province or use the default
            let coordinates = DEFAULT_COORDINATE;

            if (provinceName && provinceName in PROVINCE_COORDINATES) {
              coordinates = PROVINCE_COORDINATES[provinceName as keyof typeof PROVINCE_COORDINATES];
            }

            // Update position
            handlePositionChange(coordinates);
          }
        });

        // Create point series for marker
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Add a marker point if location is provided
        if (position) {
          pointSeries.data.push({
            geometry: { type: "Point", coordinates: [position.lng, position.lat] }
          });
        }

        // Configure the marker appearance
        pointSeries.bullets.push(function() {
          const circle = am5.Circle.new(root, {
            radius: 7,
            tooltipText: "Selected Location",
            fill: am5.color(0xFF5733),
            stroke: am5.color(0xFFFFFF),
            strokeWidth: 2
          });

          return am5.Bullet.new(root, {
            sprite: circle
          });
        });

        // Zoom to marker if location is provided, otherwise fit to map bounds
        if (position) {
          chart.zoomToGeoPoint({ longitude: position.lng, latitude: position.lat }, 4);
        } else {
          // Zoom to Afghanistan boundaries
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

  // Update marker position when position changes
  useEffect(() => {
    if (chartRef.current && isMapReady) {
      const chart = chartRef.current.container.children.getIndex(0) as am5map.MapChart;

      // Find point series
      const pointSeries = chart.series.values.find(
        series => series instanceof am5map.MapPointSeries
      ) as am5map.MapPointSeries;

      if (pointSeries) {
        if (position) {
          // Update data
          pointSeries.data.setAll([{
            geometry: { type: "Point", coordinates: [position.lng, position.lat] }
          }]);

          // Zoom to point
          chart.zoomToGeoPoint({ longitude: position.lng, latitude: position.lat }, 4);
        } else {
          // Clear markers
          pointSeries.data.setAll([]);

          // Reset zoom to Afghanistan
          chart.zoomToGeoPoint({ longitude: 67.709953, latitude: 33.93911 }, 3);
        }
      }
    }
  }, [position, isMapReady]);

  // Handle position change
  const handlePositionChange = (newPosition: { lat: number; lng: number }) => {
    setPosition(newPosition);
    onChange(newPosition);
  };

  // Handle clear button click
  const handleClear = () => {
    setPosition(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      <div
        className="rounded-md overflow-hidden border border-gray-300 h-[400px] mb-2"
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

      <div className="flex justify-between items-center">
        <div className="text-sm">
          {position ? (
            <span className="font-mono">
              Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
            </span>
          ) : (
            <span className="text-gray-500">Click on a province to select location</span>
          )}
        </div>

        {position && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:underline"
          >
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}
