<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>گزارش مرکز ملی بصیرت - بر اساس تاریخ</title>
    @vite(['resources/css/app.css'])
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
  $categories = collect($statSums)->groupBy('category_name');
    
  @endphp
  <div class="container mx-auto p-4">
    <table class="w-full border-collapse border-2 border-gray-900">
      <thead>
        <tr>
          @foreach ($categories as $key => $category) 
            <th colspan="{{ $category->count() }}" class="border-2 border-gray-900 bg-gray-900 text-white px-4 py-3 text-center font-bold">
              {{ $key }}
            </th>
          @endforeach    
        </tr>    
      </thead>
      <tbody>
        <tr>
          @foreach ($categories as $key => $category) 
            @foreach ($category as $item) 
              <td class="border-2 border-gray-900 px-4 py-3 text-gray-900 text-center">
                {{ $item->item_name }}
              </td>
            @endforeach
          @endforeach
        </tr>
        <tr>
            @foreach ($categories as $key => $category) 
              @foreach ($category as $item) 
                <td class="border-2 border-gray-900 px-4 py-3 text-gray-900 text-center">
                  {{ $item->total_integer_value ?? 0 }}
                </td>
              @endforeach
            @endforeach
          </tr>    
      </tbody>
    </table>
  </div>
  <div class="container mx-auto p-4">
    <table class="min-w-full border-collapse border-2 border-gray-900 bg-white shadow-xl rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-900 text-white">
          <th class="border-2 border-gray-900 px-6 py-3 text-center">ولایت</th>
          <th class="border-2 border-gray-900 px-6 py-3 text-center">ولسوالی</th>
          <th class="border-2 border-gray-900 px-6 py-3 text-center w-1/3">توضیحات</th>
          <th class="border-2 border-gray-900 px-6 py-3 text-center">تاریخ</th>
        </tr>
      </thead>
      <tbody>
        @forelse ($sub_items as $item)
          <tr class="hover:bg-gray-100 transition">
            <td class="border-2 border-gray-900 px-4 py-2 text-center">{{ $item->province_name }}</td>
            <td class="border-2 border-gray-900 px-4 py-2 text-center">{{ $item->district_name }}</td>
            <td class="border-2 border-gray-900 px-4 py-3 text-lg text-gray-900 whitespace-normal break-words text-justify">{{ $item->description }}</td>
            <td class="border-2 border-gray-900 px-4 py-2 text-center">{{ $item->date }}</td>
          </tr>
        @empty
          <tr>
            <td colspan="4" class="border-2 border-gray-900 px-4 py-6 text-center text-gray-500">هیچ موردی یافت نشد</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>
</html>
