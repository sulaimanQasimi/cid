import React, { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useTranslation } from '@/lib/i18n/translate';

interface ChartData {
  category: string;
  current: number;
  previous: number;
}

interface IncidentComparisonChartProps {
  data: ChartData[];
  title?: string;
  containerId: string;
  height?: number;
}

export function IncidentComparisonChart({
  data,
  title,
  containerId,
  height = 300,
}: IncidentComparisonChartProps) {
  const { t } = useTranslation();
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Dispose previous chart if exists
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    // Create root element
    const root = am5.Root.new(containerId);
    rootRef.current = root;

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minGridDistance: 30,
        }),
      })
    );

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create series for current week
    const currentSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: t('weekly_report.labels.current_week'),
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'current',
        categoryXField: 'category',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{name}: {valueY}',
        }),
      })
    );

    currentSeries.columns.template.setAll({
      fill: am5.color(0xff6b35), // Orange
      stroke: am5.color(0xff6b35),
      strokeWidth: 1,
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
    });

    currentSeries.data.setAll(data);

    // Create series for previous week
    const previousSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: t('weekly_report.labels.previous_week'),
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'previous',
        categoryXField: 'category',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{name}: {valueY}',
        }),
      })
    );

    previousSeries.columns.template.setAll({
      fill: am5.color(0xffd23f), // Yellow
      stroke: am5.color(0xffd23f),
      strokeWidth: 1,
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
    });

    previousSeries.data.setAll(data);

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        centerY: am5.p100,
        y: am5.p100,
      })
    );

    legend.data.setAll([currentSeries, previousSeries]);

    // Add title if provided
    if (title) {
      const titleElement = chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          x: am5.p50,
          centerX: am5.p50,
          paddingTop: 0,
          paddingBottom: 10,
        })
      );
    }

    return () => {
      if (root && !root.isDisposed()) {
        root.dispose();
      }
    };
  }, [data, containerId, title, t]);

  return <div id={containerId} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px` }} />;
}

interface CasualtiesChartProps {
  data: {
    category: string;
    dead: number;
    injured: number;
    captured: number;
    surrendered: number;
  }[];
  title?: string;
  containerId: string;
  height?: number;
}

export function CasualtiesChart({
  data,
  title,
  containerId,
  height = 300,
}: CasualtiesChartProps) {
  const { t } = useTranslation();
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new(containerId);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
      })
    );

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const colors = [
      am5.color(0xdc2626), // Red for dead
      am5.color(0x10b981), // Green for injured
      am5.color(0x1f2937), // Black for captured
      am5.color(0x3b82f6), // Blue for surrendered
    ];

    const seriesNames = [
      t('weekly_report.labels.dead'),
      t('weekly_report.labels.injured'),
      t('weekly_report.labels.captured'),
      t('weekly_report.labels.surrendered'),
    ];

    const valueFields = ['dead', 'injured', 'captured', 'surrendered'];

    valueFields.forEach((field, index) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: seriesNames[index],
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          categoryXField: 'category',
          tooltip: am5.Tooltip.new(root, {
            labelText: '{name}: {valueY}',
          }),
        })
      );

      series.columns.template.setAll({
        fill: colors[index],
        stroke: colors[index],
        strokeWidth: 1,
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
      });

      series.data.setAll(data);
    });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        centerY: am5.p100,
        y: am5.p100,
      })
    );

    legend.data.setAll(chart.series.values);

    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          x: am5.p50,
          centerX: am5.p50,
          paddingTop: 0,
          paddingBottom: 10,
        })
      );
    }

    return () => {
      if (root && !root.isDisposed()) {
        root.dispose();
      }
    };
  }, [data, containerId, title, t]);

  return <div id={containerId} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px` }} />;
}

interface SimpleComparisonChartProps {
  current: number;
  previous: number;
  title?: string;
  containerId: string;
  height?: number;
  currentLabel?: string;
  previousLabel?: string;
}

export function SimpleComparisonChart({
  current,
  previous,
  title,
  containerId,
  height = 200,
  currentLabel,
  previousLabel,
}: SimpleComparisonChartProps) {
  const { t } = useTranslation();
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    if (rootRef.current && !rootRef.current.isDisposed()) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new(containerId);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      })
    );

    const data = [
      {
        category: currentLabel || t('weekly_report.labels.current_week'),
        value: current,
      },
      {
        category: previousLabel || t('weekly_report.labels.previous_week'),
        value: previous,
      },
    ];

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
      })
    );

    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'category',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );

    series.columns.template.setAll({
      fill: am5.color(0x3b82f6),
      stroke: am5.color(0x3b82f6),
      strokeWidth: 1,
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
    });

    series.data.setAll(data);

    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          x: am5.p50,
          centerX: am5.p50,
          paddingTop: 0,
          paddingBottom: 10,
        })
      );
    }

    return () => {
      if (root && !root.isDisposed()) {
        root.dispose();
      }
    };
  }, [current, previous, containerId, title, currentLabel, previousLabel, t]);

  return <div id={containerId} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px` }} />;
}

