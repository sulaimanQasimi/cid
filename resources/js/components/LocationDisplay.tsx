import React, { useEffect, useRef, useState } from 'react';

// Import amCharts
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_afghanistanLow from '@amcharts/amcharts5-geodata/afghanistanLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface LocationDisplayProps {
  location: { lat: number; lng: number };
}

export default function LocationDisplay({ location }: LocationDisplayProps) {
  // Create refs for chart
  const chartRef = useRef<am5.Root | null>(null);
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

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

        // Create main polygon series for countries
        const polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_afghanistanLow,
            fill: am5.color(0xDDDDDD),
            stroke: am5.color(0xFFFFFF)
          })
        );

        // Create polygon series for provinces
        const provinceSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_afghanistanLow,
            valueField: "value"
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

        // Create point series for marker
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Add a marker point if location is provided
        if (location) {
          pointSeries.data.push({
            geometry: { type: "Point", coordinates: [location.lng, location.lat] }
          });
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
      }
    }
  }, [location, isMapReady]);

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
        {location ? `Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}` : 'No location data'}
      </div>
    </div>
  );
}
