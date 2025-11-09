<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>گزارش مرکز ملی بصیرت - بر اساس تاریخ</title>
    <style>
        @media print {
            @page {
                size: A4 landscape;
                margin: 1cm;
            }
            .no-print {
                display: none !important;
            }
            .page-break {
                page-break-after: always;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Tahoma', 'Arial', sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            background: #fff;
            padding: 15px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #7c3aed;
        }
        
        .header h1 {
            font-size: 20px;
            color: #7c3aed;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .header .subtitle {
            font-size: 12px;
            color: #666;
        }
        
        .info-section {
            margin-bottom: 15px;
            padding: 10px;
            background: #f9fafb;
            border-right: 4px solid #7c3aed;
            border-radius: 5px;
            font-size: 10px;
        }
        
        .info-section h2 {
            font-size: 13px;
            color: #7c3aed;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: bold;
            color: #555;
            min-width: 120px;
        }
        
        .info-value {
            color: #333;
            text-align: right;
        }
        
        .main-info-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .main-info-header {
            background: #7c3aed;
            color: #fff;
            padding: 10px;
            font-weight: bold;
            font-size: 12px;
            border-radius: 5px 5px 0 0;
        }
        
        .main-info-content {
            border: 2px solid #7c3aed;
            border-top: none;
            padding: 10px;
            background: #fff;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background: #fff;
            font-size: 9px;
        }
        
        .main-table thead {
            background: #7c3aed;
            color: #fff;
        }
        
        .main-table th {
            padding: 8px 6px;
            text-align: right;
            font-weight: bold;
            font-size: 10px;
            border: 1px solid #6d28d9;
        }
        
        .main-table td {
            padding: 6px;
            text-align: right;
            border: 1px solid #e5e7eb;
            font-size: 9px;
        }
        
        .main-table tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .sub-info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 8px;
        }
        
        .sub-info-table thead {
            background: #a78bfa;
            color: #fff;
        }
        
        .sub-info-table th {
            padding: 6px 4px;
            text-align: right;
            font-weight: bold;
            font-size: 9px;
            border: 1px solid #8b5cf6;
        }
        
        .sub-info-table td {
            padding: 4px;
            text-align: right;
            border: 1px solid #e5e7eb;
            font-size: 8px;
        }
        
        .sub-info-table tbody tr:nth-child(even) {
            background: #f3f4f6;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        
        .badge-confirmed {
            background: #10b981;
            color: #fff;
        }
        
        .badge-pending {
            background: #f59e0b;
            color: #fff;
        }
        
        .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 9px;
        }
        
        .no-data {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 12px;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 12px 24px;
            background: #7c3aed;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #6d28d9;
        }
        
        .back-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #6b7280;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
            text-decoration: none;
            display: inline-block;
        }
        
        .back-button:hover {
            background: #4b5563;
        }
        
        .sub-info-section {
            margin-top: 15px;
            padding: 10px;
            background: #f9fafb;
            border-right: 3px solid #a78bfa;
            border-radius: 5px;
        }
        
        .sub-info-section h3 {
            font-size: 11px;
            color: #7c3aed;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .stats-section {
            margin-top: 30px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .stats-grid {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #333;
            font-size: 9px;
        }
        
        .stats-grid td,
        .stats-grid th {
            border: 2px solid #333;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
        }
        
        .category-header {
            background: #7c3aed;
            color: #fff;
            font-weight: bold;
            font-size: 11px;
            height: 40px;
        }
        
        .title-cell {
            background: #f3f4f6;
            font-weight: bold;
            font-size: 9px;
            height: 60px;
            vertical-align: middle;
        }
        
        .value-cell {
            background: #fff;
            font-size: 10px;
            font-weight: bold;
            color: #7c3aed;
            height: 50px;
            vertical-align: middle;
        }
        
        .stats-section-header {
            margin-bottom: 15px;
            font-size: 14px;
            font-weight: bold;
            color: #7c3aed;
            text-align: center;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ چاپ</button>
    <a href="{{ route('national-insight-center-infos.report') }}" class="back-button no-print">بازگشت</a>
    
    <div class="header">
        <h1>گزارش مرکز ملی بصیرت</h1>
        <div class="subtitle" style="rtl">
            @if(isset($dateFrom) && isset($dateTo))
                گزارش بر اساس از تاریخ {{ $dateFrom }} تا {{ $dateTo }}
            @elseif(isset($dateFrom))
                گزارش بر اساس از تاریخ {{ $dateFrom }}
            @elseif(isset($dateTo))
                گزارش بر اساس تا تاریخ {{ $dateTo }}
            @else
                گزارش کامل
            @endif
        </div>
    </div>
    
    @php
        $sub_items = $sub_items ?? [];
        $statSums = $statSums ?? [];
    @endphp
    
    @if(count($sub_items) > 0)
        @php
            // Group sub_items by national_insight_center_info_id
            $groupedItems = collect($sub_items)->groupBy('national_insight_center_info_id');
        @endphp
        
        @foreach($groupedItems as $infoId => $items)
            <div class="main-info-section">
                <div class="main-info-header">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>شناسه: {{ $infoId }}</span>
                    </div>
                </div>
                <div class="main-info-content">
                    <div class="sub-info-section">
                        <h3>آیتم‌های اطلاعات ({{ $items->count() }} مورد)</h3>
                        <table class="sub-info-table">
                            <thead>
                                <tr>
                                    <th>شناسه</th>
                                    <th>عنوان</th>
                                    <th>شماره ثبت</th>
                                    <th>تاریخ</th>
                                    <th>وضعیت</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($items as $item)
                                    <tr>
                                        <td>{{ $item->id }}</td>
                                        <td>{{ $item->title ?? '-' }}</td>
                                        <td>{{ $item->registration_number ?? '-' }}</td>
                                        <td>
                                            @if(isset($item->date))
                                                {{ \App\Services\PersianDateService::fromCarbon(\Carbon\Carbon::parse($item->date)) }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                        <td>
                                            @if(isset($item->confirmed) && $item->confirmed)
                                                <span class="badge badge-confirmed">تأیید</span>
                                            @else
                                                <span class="badge badge-pending">در انتظار</span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @endforeach
        
        @if(count($statSums) > 0)
            @php
                // Group statSums by category_id
                $groupedStats = collect($statSums)->groupBy('category_id');
            @endphp
            
            <div class="stats-section">
                <div class="stats-section-header">
                    آمار تجمعی بر اساس دسته‌بندی
                </div>
                
                <table class="stats-grid">
                    <!-- Category Headers Row -->
                    <tr>
                        @foreach($groupedStats as $categoryId => $categoryStats)
                            <th class="category-header" colspan="{{ $categoryStats->count() }}">
                                {{ $categoryStats->first()->category_label ?? 'دسته‌بندی ' . $categoryId }}
                            </th>
                        @endforeach
                    </tr>
                    
                    <!-- Title Row -->
                    <tr>
                        @foreach($groupedStats as $categoryId => $categoryStats)
                            @foreach($categoryStats as $stat)
                                <td class="title-cell">
                                    {{ $stat->item_label ?? $stat->item_name ?? '-' }}
                                </td>
                            @endforeach
                        @endforeach
                    </tr>
                    
                    <!-- Value Row -->
                    <tr>
                        @foreach($groupedStats as $categoryId => $categoryStats)
                            @foreach($categoryStats as $stat)
                                <td class="value-cell">
                                    @if(isset($stat->string_value) && $stat->string_value !== null)
                                        {{ $stat->string_value }}
                                    @else
                                        -
                                    @endif
                                </td>
                            @endforeach
                        @endforeach
                    </tr>
                </table>
            </div>
        @endif
    @else
        <div class="no-data">
            <p>هیچ رکوردی با فیلترهای انتخابی یافت نشد.</p>
        </div>
    @endif
    
    <div class="footer">
        <p>این گزارش در تاریخ {{ \App\Services\PersianDateService::fromCarbon(\Carbon\Carbon::now()) }} تولید شده است.</p>
        <p>سیستم مدیریت اطلاعات مرکز ملی بصیرت</p>
    </div>
</body>
</html>
