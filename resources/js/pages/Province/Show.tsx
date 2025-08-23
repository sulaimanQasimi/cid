import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { ArrowLeft, Edit, Eye, MapPin, Users, Calendar, User, Clock, FileText, BarChart3, TrendingUp, AlertTriangle, Plus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';

// Map of province codes to simplified SVG paths
const provincePaths: { [key: string]: string } = {
  'AF-BAL': 'M350,180 C350,180 400,130 450,140 C500,150 550,180 550,220 C550,260 500,290 450,300 C400,310 350,280 330,250 C310,220 350,180 350,180 Z',
  'AF-BAM': 'M380,220 C380,220 420,200 460,210 C500,220 520,250 510,290 C500,330 460,350 420,340 C380,330 360,290 370,250 C380,210 380,220 380,220 Z',
  'AF-BDG': 'M280,190 C280,190 330,170 370,190 C410,210 430,250 410,290 C390,330 340,350 300,330 C260,310 250,260 270,220 C290,180 280,190 280,190 Z',
  'AF-BDS': 'M500,100 C500,100 550,80 600,100 C650,120 670,170 650,220 C630,270 580,290 530,270 C480,250 470,190 490,140 C510,90 500,100 500,100 Z',
  'AF-BGL': 'M420,150 C420,150 470,130 520,150 C570,170 590,220 570,270 C550,320 500,340 450,320 C400,300 390,240 410,190 C430,140 420,150 420,150 Z',
  'AF-DAY': 'M350,280 C350,280 400,260 450,280 C500,300 520,350 500,400 C480,450 430,470 380,450 C330,430 320,370 340,320 C360,270 350,280 350,280 Z',
  'AF-FRA': 'M250,330 C250,330 300,310 350,330 C400,350 420,400 400,450 C380,500 330,520 280,500 C230,480 220,420 240,370 C260,320 250,330 250,330 Z',
  'AF-FYB': 'M180,220 C180,220 230,200 280,220 C330,240 350,290 330,340 C310,390 260,410 210,390 C160,370 150,310 170,260 C190,210 180,220 180,220 Z',
  'AF-GHA': 'M400,350 C400,350 450,330 500,350 C550,370 570,420 550,470 C530,520 480,540 430,520 C380,500 370,440 390,390 C410,340 400,350 400,350 Z',
  'AF-GHO': 'M320,300 C320,300 370,280 420,300 C470,320 490,370 470,420 C450,470 400,490 350,470 C300,450 290,390 310,340 C330,290 320,300 320,300 Z',
  'AF-HEL': 'M270,380 C270,380 320,360 370,380 C420,400 440,450 420,500 C400,550 350,570 300,550 C250,530 240,470 260,420 C280,370 270,380 270,380 Z',
  'AF-HER': 'M200,300 C200,300 250,280 300,300 C350,320 370,370 350,420 C330,470 280,490 230,470 C180,450 170,390 190,340 C210,290 200,300 200,300 Z',
  'AF-JOW': 'M150,180 C150,180 200,160 250,180 C300,200 320,250 300,300 C280,350 230,370 180,350 C130,330 120,270 140,220 C160,170 150,180 150,180 Z',
  'AF-KAB': 'M450,250 C450,250 500,230 550,250 C600,270 620,320 600,370 C580,420 530,440 480,420 C430,400 420,340 440,290 C460,240 450,250 450,250 Z',
  'AF-KAN': 'M300,420 C300,420 350,400 400,420 C450,440 470,490 450,540 C430,590 380,610 330,590 C280,570 270,510 290,460 C310,410 300,420 300,420 Z',
  'AF-KAP': 'M480,220 C480,220 530,200 580,220 C630,240 650,290 630,340 C610,390 560,410 510,390 C460,370 450,310 470,260 C490,210 480,220 480,220 Z',
  'AF-KDZ': 'M430,130 C430,130 480,110 530,130 C580,150 600,200 580,250 C560,300 510,320 460,300 C410,280 400,220 420,170 C440,120 430,130 430,130 Z',
  'AF-KHO': 'M480,320 C480,320 530,300 580,320 C630,340 650,390 630,440 C610,490 560,510 510,490 C460,470 450,410 470,360 C490,310 480,320 480,320 Z',
  'AF-KNR': 'M520,280 C520,280 570,260 620,280 C670,300 690,350 670,400 C650,450 600,470 550,450 C500,430 490,370 510,320 C530,270 520,280 520,280 Z',
  'AF-LAG': 'M500,270 C500,270 550,250 600,270 C650,290 670,340 650,390 C630,440 580,460 530,440 C480,420 470,360 490,310 C510,260 500,270 500,270 Z',
  'AF-LOG': 'M450,280 C450,280 500,260 550,280 C600,300 620,350 600,400 C580,450 530,470 480,450 C430,430 420,370 440,320 C460,270 450,280 450,280 Z',
  'AF-NAN': 'M550,250 C550,250 600,230 650,250 C700,270 720,320 700,370 C680,420 630,440 580,420 C530,400 520,340 540,290 C560,240 550,250 550,250 Z',
  'AF-NIM': 'M220,350 C220,350 270,330 320,350 C370,370 390,420 370,470 C350,520 300,540 250,520 C200,500 190,440 210,390 C230,340 220,350 220,350 Z',
  'AF-NUR': 'M530,200 C530,200 580,180 630,200 C680,220 700,270 680,320 C660,370 610,390 560,370 C510,350 500,290 520,240 C540,190 530,200 530,200 Z',
  'AF-PAN': 'M470,180 C470,180 520,160 570,180 C620,200 640,250 620,300 C600,350 550,370 500,350 C450,330 440,270 460,220 C480,170 470,180 470,180 Z',
  'AF-PAR': 'M420,200 C420,200 470,180 520,200 C570,220 590,270 570,320 C550,370 500,390 450,370 C400,350 390,290 410,240 C430,190 420,200 420,200 Z',
  'AF-PIA': 'M440,320 C440,320 490,300 540,320 C590,340 610,390 590,440 C570,490 520,510 470,490 C420,470 410,410 430,360 C450,310 440,320 440,320 Z',
  'AF-PKA': 'M400,380 C400,380 450,360 500,380 C550,400 570,450 550,500 C530,550 480,570 430,550 C380,530 370,470 390,420 C410,370 400,380 400,380 Z',
  'AF-SAM': 'M320,180 C320,180 370,160 420,180 C470,200 490,250 470,300 C450,350 400,370 350,350 C300,330 290,270 310,220 C330,170 320,180 320,180 Z',
  'AF-SAR': 'M280,150 C280,150 330,130 380,150 C430,170 450,220 430,270 C410,320 360,340 310,320 C260,300 250,240 270,190 C290,140 280,150 280,150 Z',
  'AF-TAK': 'M450,100 C450,100 500,80 550,100 C600,120 620,170 600,220 C580,270 530,290 480,270 C430,250 420,190 440,140 C460,90 450,100 450,100 Z',
  'AF-URU': 'M350,350 C350,350 400,330 450,350 C500,370 520,420 500,470 C480,520 430,540 380,520 C330,500 320,440 340,390 C360,340 350,350 350,350 Z',
  'AF-WAR': 'M400,300 C400,300 450,280 500,300 C550,320 570,370 550,420 C530,470 480,490 430,470 C380,450 370,390 390,340 C410,290 400,300 400,300 Z',
  'AF-ZAB': 'M350,400 C350,400 400,380 450,400 C500,420 520,470 500,520 C480,570 430,590 380,570 C330,550 320,490 340,440 C360,390 350,400 350,400 Z',
  'default': 'M400,150 L450,200 L500,180 L550,200 L600,250 L550,300 L500,350 L450,400 L400,450 L350,400 L300,350 L250,300 L200,250 L250,200 L300,180 L350,200 Z'
};

// Map color configurations based on province status
const provinceColors = {
  active: '#5D87FF',
  inactive: '#94A3B8'
};

interface DistrictData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  province_id: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface ProvinceData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface ShowProps {
  province: ProvinceData;
  districts: {
    data: DistrictData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Show({ province, districts }: ShowProps) {
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const { t } = useTranslation();
  
  const chartRef = useRef<HTMLDivElement>(null);
  const rootInstanceRef = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('dashboard.page_title'),
      href: route('dashboard'),
    },
    {
      title: t('provinces.page_title'),
      href: route('provinces.index'),
    },
    {
      title: province.name,
      href: '#',
    },
  ];

  // Function to dispose the chart when unmounting or when province changes
  const disposeChart = () => {
    if (rootInstanceRef.current) {
      rootInstanceRef.current.dispose();
      rootInstanceRef.current = null;
    }
  };

  useEffect(() => {
    // Cleanup function to run when component unmounts
    return () => {
      disposeChart();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    // Always dispose the previous chart when province changes
    disposeChart();

    // Create an ID for this specific instance
    const chartId = `province-map-${province.id}`;

    // Make sure the element has an ID
    chartRef.current.id = chartId;

    // Clear the contents of the div
    chartRef.current.innerHTML = '';

    // Set loading state
    chartRef.current.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block"></div>
          <p class="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    `;

    const loadMap = async () => {
      try {
        // Verify the element still exists
        if (!chartRef.current) return;

        // Import amCharts modules
        const am5 = await import('@amcharts/amcharts5');
        const am5map = await import('@amcharts/amcharts5/map');
        const am5themes = await import('@amcharts/amcharts5/themes/Animated');

        // Import Afghanistan geodata
        const afghanistanGeodata = await import('@amcharts/amcharts5-geodata/afghanistanLow');

        // One more check to ensure the element exists
        if (!chartRef.current) return;

        // Clear the div
        chartRef.current.innerHTML = '';

        // Create root element
        const root = am5.Root.new(chartId);
        rootInstanceRef.current = root;

        // Set themes
        root.setThemes([am5themes.default.new(root)]);

        // Create the map chart
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            projection: am5map.geoMercator(),
            layout: root.verticalLayout
          })
        );

        // Create main polygon series for all provinces
        const allProvincesSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: afghanistanGeodata.default,
            fill: am5.color(0xDDDDDD),
            stroke: am5.color(0xFFFFFF)
          })
        );

        // Set provinces to be interactive
        allProvincesSeries.mapPolygons.template.setAll({
          tooltipText: "{name}",
          interactive: true,
          strokeWidth: 1
        });

        // Add hover state
        allProvincesSeries.mapPolygons.template.states.create("hover", {
          fill: am5.color(0xBBBBBB)
        });

        // Create polygon series for the highlighted province
        const highlightSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: afghanistanGeodata.default,
            include: [province.code]
          })
        );

        // Configure highlighted province
        highlightSeries.mapPolygons.template.setAll({
          fill: am5.color(provinceColors[province.status as keyof typeof provinceColors] || provinceColors.active),
          stroke: am5.color(0xFFFFFF),
          tooltipText: "{name}",
          interactive: true,
          strokeWidth: 2
        });

        // Set up zooming
        chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

        // Animate map appearance
        chart.appear(1000, 100);

        // Add a label for the province
        const labelSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Add zoom to selected province after a delay to ensure map is loaded
        setTimeout(() => {
          // Find the highlighted province
          if (highlightSeries.mapPolygons.length > 0) {
            const polygonObj = highlightSeries.mapPolygons.getIndex(0);
            if (polygonObj) {
              // Get the bounds for zooming - use zoomToGeoPoint instead of zoomToMapObject
              const centroid = polygonObj.visualCentroid();
              chart.zoomToGeoPoint({ latitude: centroid.latitude, longitude: centroid.longitude }, 1.5);

              // Add a label in the middle of the province
              const dataItem = polygonObj.dataItem;
              if (dataItem) {
                labelSeries.data.push({
                  latitude: centroid.latitude,
                  longitude: centroid.longitude,
                  name: province.name
                });
              }
            }
          } else {
            // If province not found, show the whole map
            chart.goHome(1000);
          }

          // Add bullets to the label series
          labelSeries.bullets.push(() => {
            return am5.Bullet.new(root, {
              sprite: am5.Label.new(root, {
                text: "{name}",
                centerX: am5.p50,
                centerY: am5.p50,
                populateText: true,
                fontWeight: "bold",
                fontSize: 14
              })
            });
          });
        }, 1000);

        setMapInitialized(true);
      } catch (error) {
        console.error("Error loading amCharts:", error);

        // Display error message in the chart container
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full">
              <div class="text-center p-4">
                <p class="text-red-500">Error loading map: ${error instanceof Error ? error.message : 'Unknown error'}</p>
                <p class="text-xs text-gray-500 mt-2">Please check console for details</p>
              </div>
            </div>
          `;
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadMap();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [province.id, province.code, province.status, province.name]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('provinces.show.title', { name: province.name })} />
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
                {t('common.back')}
              </Button>
              
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{province.name}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('provinces.show.description', { code: province.code })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CanUpdate model="province">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                  <Link href={route('provinces.edit', province.id)} className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                      <Edit className="h-5 w-5" />
                    </div>
                    {t('common.edit')}
                  </Link>
                </Button>
              </CanUpdate>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Province Details Card */}
          <Card className="md:col-span-2 shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('provinces.show.details_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('provinces.show.details_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex flex-wrap gap-3">
                {province.capital && (
                  <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-purple-700 border-purple-300 bg-purple-50">
                    <MapPin className="h-4 w-4" />
                    {t('provinces.show.capital')}: {province.capital}
                  </Badge>
                )}
                {province.governor && (
                  <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-purple-700 border-purple-300 bg-purple-50">
                    <User className="h-4 w-4" />
                    {t('provinces.show.governor')}: {province.governor}
                  </Badge>
                )}
                <Badge
                  variant={province.status === 'active' ? 'default' : 'secondary'}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {province.status}
                </Badge>
              </div>

              {/* Province Map */}
              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-4">{t('provinces.show.map_title')}</h3>
                <div
                  ref={chartRef}
                  className="h-[400px] w-full bg-gradient-to-l from-purple-50 to-white rounded-2xl overflow-hidden shadow-lg border border-purple-200"
                ></div>
                <p className="text-sm text-purple-600 mt-3 font-medium">
                  {t('provinces.show.map_description', { name: province.name })}
                </p>
              </div>

              {province.description && (
                <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-4">{t('provinces.show.description_title')}</h3>
                  <div className="whitespace-pre-wrap text-purple-800 bg-gradient-to-l from-purple-50 to-white p-6 rounded-2xl border border-purple-200">
                    {province.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Province Information Card */}
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('provinces.show.info_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('provinces.show.info_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-purple-50 to-white rounded-xl border border-purple-200">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-purple-600">{t('provinces.show.created_by')}</div>
                    <div className="text-purple-900 font-semibold">{province.creator?.name || t('common.unknown')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-purple-50 to-white rounded-xl border border-purple-200">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-purple-600">{t('provinces.show.created_at')}</div>
                    <div className="text-purple-900 font-semibold">{format(new Date(province.created_at), 'PPP')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-l from-purple-50 to-white rounded-xl border border-purple-200">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-purple-600">{t('provinces.show.updated_at')}</div>
                    <div className="text-purple-900 font-semibold">{format(new Date(province.updated_at), 'PPP p')}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200">
                <CanCreate model="district">
                  <Button variant="outline" className="w-full h-12 bg-gradient-to-l from-purple-50 to-white border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105" asChild>
                    <Link href={route('districts.create', { province_id: province.id })}>
                      <MapPin className="mr-2 h-5 w-5" />
                      {t('provinces.show.add_district')}
                    </Link>
                  </Button>
                </CanCreate>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Districts Table */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('provinces.show.districts_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('provinces.show.districts_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                    <tr className="border-b border-purple-200">
                      <th className="h-16 px-6 text-left align-middle font-bold text-purple-800 text-lg">{t('provinces.show.districts_table.name')}</th>
                      <th className="h-16 px-6 text-left align-middle font-bold text-purple-800 text-lg">{t('provinces.show.districts_table.code')}</th>
                      <th className="h-16 px-6 text-left align-middle font-bold text-purple-800 text-lg">{t('provinces.show.districts_table.status')}</th>
                      <th className="h-16 px-6 text-left align-middle font-bold text-purple-800 text-lg">{t('provinces.show.districts_table.created_by')}</th>
                      <th className="h-16 px-6 text-left align-middle font-bold text-purple-800 text-lg">{t('provinces.show.districts_table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districts.data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-purple-600">
                            <div className="p-4 bg-purple-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400" />
                            </div>
                            <p className="text-xl font-bold">{t('provinces.show.no_districts')}</p>
                            <p className="text-purple-500">{t('provinces.show.no_districts_description')}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      districts.data.map((district) => (
                        <tr key={district.id} className="border-b border-purple-100 hover:bg-purple-50/50 transition-colors duration-300">
                          <td className="p-6">
                            <CanView model="district">
                              <Link
                                href={route('districts.show', district.id)}
                                className="font-bold text-purple-900 hover:text-purple-700 transition-colors duration-300 flex items-center gap-2 text-lg"
                              >
                                <MapPin className="h-5 w-5" />
                                {district.name}
                              </Link>
                            </CanView>
                          </td>
                          <td className="font-bold text-purple-900 p-6 text-lg">{district.code}</td>
                          <td className="p-6">
                            <Badge variant={district.status === 'active' ? 'default' : 'secondary'} className="text-sm font-semibold">
                              {district.status}
                            </Badge>
                          </td>
                          <td className="text-purple-800 p-6 font-medium">
                            {district.creator?.name || '-'}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <CanView model="district">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('provinces.show.districts_table.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('districts.show', district.id)}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="district">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('provinces.show.districts_table.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('districts.edit', district.id)}>
                                    <Edit className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {districts.links && districts.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 to-white p-4 rounded-3xl shadow-2xl border border-purple-200">
              <Pagination links={districts.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
