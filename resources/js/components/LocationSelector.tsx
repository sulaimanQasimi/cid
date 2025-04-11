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

// Default to center of Afghanistan if province not found
const DEFAULT_COORDINATE = { lat: 33.9391, lng: 67.7100 };

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  // Create refs for chart
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);

  // State to track the selected position
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

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

        // Create state for selected province
        provinceSeries.mapPolygons.template.states.create("selected", {
          fill: am5.color(0xFF5733)
        });

        // Add click events on provinces using any to bypass TypeScript strictness
        provinceSeries.mapPolygons.template.events.on("click", function(ev) {
          // Use any to bypass TypeScript strict typing
          const target = ev.target as any;
          const dataItem = target.dataItem as any;

          if (dataItem && dataItem.dataContext) {
            // Try to get province name
            const provinceName = dataItem.dataContext.name;

            // Reset all provinces to default state
            provinceSeries.mapPolygons.each(function(polygon) {
              polygon.states.applyAnimate("default");
            });

            // Set this province to selected state
            target.states.applyAnimate("selected");

            // Update selected province
            setSelectedProvince(provinceName);

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

          // Try to highlight the corresponding province if this is an initial position
          if (value) {
            // Find the province by matching coordinates
            for (const [provinceName, coords] of Object.entries(PROVINCE_COORDINATES)) {
              if (Math.abs(coords.lat - value.lat) < 0.01 && Math.abs(coords.lng - value.lng) < 0.01) {
                setSelectedProvince(provinceName);
                break;
              }
            }
          }
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
    setSelectedProvince(null);
    onChange(null);

    // Clear selected province state if chart exists
    if (chartRef.current && isMapReady) {
      const chart = chartRef.current.container.children.getIndex(0) as am5map.MapChart;
      const provinceSeries = chart.series.values.find(
        series => series instanceof am5map.MapPolygonSeries
      ) as am5map.MapPolygonSeries;

      if (provinceSeries) {
        provinceSeries.mapPolygons.each(function(polygon) {
          polygon.states.applyAnimate("default");
        });
      }
    }
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
              {selectedProvince ? `${selectedProvince} Province: ` : ''}
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
