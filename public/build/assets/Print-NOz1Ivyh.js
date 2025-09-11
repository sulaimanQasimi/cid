import{r as g,j as t,L as h}from"./app-Dxyb4tjP.js";import{B as d}from"./button-B5hvMkID.js";import{C as s,a as p,b as m,d as o}from"./card-gqeyKRBF.js";import{B as x}from"./badge-CFIMvubG.js";import{u as b}from"./translate-DRO0aTlv.js";import{b as f,a as y}from"./date-BaJKjiu2.js";import{A as j}from"./arrow-left-L8xK0F6t.js";import{P as N}from"./printer-DZoe9t9B.js";import{F as l}from"./file-text-BnK35OVo.js";import{C as u}from"./chart-column-CZi6LORu.js";import{D as _}from"./database-DXZEawtm.js";import{C as w}from"./calendar-tO7zHpXq.js";import"./utils-D08MpAnR.js";import"./createLucideIcon-CizsRpcm.js";function R({infoType:i,infos:n,statCategories:v}){const{t:r}=b();g.useEffect(()=>{const e=setTimeout(()=>{window.print()},1e3);return()=>clearTimeout(e)},[]);const a=e=>y(e),c=e=>e?t.jsx(x,{variant:"outline",className:"px-3 py-1 rounded-lg font-semibold bg-green-100 text-green-800 border-green-300",children:"Confirmed"}):t.jsx(x,{variant:"outline",className:"px-3 py-1 rounded-lg font-semibold bg-yellow-100 text-yellow-800 border-yellow-300",children:"Pending"});return t.jsxs(t.Fragment,{children:[t.jsx(h,{title:r("info_types.print.title",{name:i.name||"Info Type"})}),t.jsx("div",{className:"print:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50",children:t.jsxs("div",{className:"container mx-auto flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs(d,{variant:"outline",onClick:()=>window.history.back(),className:"flex items-center gap-2",children:[t.jsx(j,{className:"h-4 w-4"}),r("info_types.print.back_button")]}),t.jsx("h1",{className:"text-xl font-semibold text-gray-800",children:r("info_types.print.page_title",{name:i.name||"Info Type"})})]}),t.jsxs(d,{onClick:()=>window.print(),className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700",children:[t.jsx(N,{className:"h-4 w-4"}),r("info_types.print.print_button")]})]})}),t.jsxs("div",{className:"container mx-auto p-6 print:p-2 print:mx-0 print:max-w-none",children:[t.jsxs("div",{className:"text-center mb-6 print:mb-3 print:pb-2 print:border-b print:border-gray-300",children:[t.jsxs("div",{className:"flex items-center justify-center gap-2 mb-2 print:mb-1",children:[t.jsx("div",{className:"p-2 bg-purple-100 rounded-full print:p-1",children:t.jsx(l,{className:"h-6 w-6 text-purple-600 print:h-4 print:w-4"})}),t.jsx("h1",{className:"text-2xl font-bold text-gray-900 print:text-lg print:font-semibold",children:i.name||"Info Type"})]}),t.jsx("div",{className:"text-gray-600 text-base print:text-sm print:font-medium",children:r("info_types.print.report_title")}),t.jsxs("div",{className:"text-gray-500 text-xs print:text-xs mt-1",children:[r("info_types.print.generated_on"),": ",f(new Date().toISOString())]})]}),t.jsxs(s,{className:"mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300",children:[t.jsx(p,{className:" text-black print:bg-gray-100 print:text-black print:py-2",children:t.jsxs(m,{className:"flex items-center gap-2 print:gap-1",children:[t.jsx("div",{className:"p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5",children:t.jsx(l,{className:"h-4 w-4 print:h-3 print:w-3"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-lg font-bold print:text-sm print:font-semibold",children:r("info_types.print.details_title")}),t.jsx("div",{className:"text-black text-xs print:text-gray-600 print:text-xs",children:r("info_types.print.details_description")})]})]})}),t.jsx(o,{className:"p-4 print:p-2",children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2",children:[t.jsxs("div",{className:"space-y-2 print:space-y-1",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium",children:r("info_types.print.name_label")}),t.jsx("p",{className:"text-base font-bold text-gray-900 print:text-sm print:font-semibold",children:i.name||"Info Type"})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium",children:r("info_types.print.description_label")}),t.jsx("p",{className:"text-sm text-gray-800 print:text-xs print:leading-tight",children:i.description||r("info_types.print.no_description")})]})]}),t.jsxs("div",{className:"space-y-2 print:space-y-1",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium",children:r("info_types.print.created_at_label")}),t.jsx("p",{className:"text-sm text-gray-800 print:text-xs",children:a(i.created_at)})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium",children:r("info_types.print.updated_at_label")}),t.jsx("p",{className:"text-sm text-gray-800 print:text-xs",children:a(i.updated_at)})]}),i.creator&&i.creator.name&&t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium",children:r("info_types.print.created_by_label")}),t.jsx("p",{className:"text-sm text-gray-800 print:text-xs",children:i.creator.name})]})]})]})})]}),i.infoStats&&i.infoStats.length>0&&t.jsxs(s,{className:"mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300",children:[t.jsx(p,{className:"bg-gradient-to-r from-green-500 to-green-600 text-white print:bg-gray-100 print:text-gray-900 print:py-2",children:t.jsxs(m,{className:"flex items-center gap-2 print:gap-1",children:[t.jsx("div",{className:"p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5",children:t.jsx(u,{className:"h-4 w-4 print:h-3 print:w-3"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-lg font-bold print:text-sm print:font-semibold",children:r("info_types.print.stats_title")}),t.jsx("div",{className:"text-green-100 text-xs print:text-gray-600 print:text-xs",children:r("info_types.print.stats_description")})]})]})}),t.jsx(o,{className:"p-4 print:p-2",children:t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-1",children:i.infoStats.map(e=>t.jsxs("div",{className:"bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-200 print:p-1",children:[t.jsxs("div",{className:"flex items-center gap-1 mb-1 print:mb-0.5",children:[t.jsx("div",{className:"w-2 h-2 rounded-full print:w-1.5 print:h-1.5",style:{backgroundColor:e.stat_category_item.category.color}}),t.jsx("span",{className:"text-xs font-medium text-gray-700 print:text-xs print:font-normal",children:e.stat_category_item.category.label})]}),t.jsx("h4",{className:"font-semibold text-gray-900 mb-1 print:text-xs print:font-medium",children:e.stat_category_item.label}),t.jsx("p",{className:"text-base font-bold text-green-600 mb-1 print:text-sm print:font-semibold",children:e.integer_value!==null?e.integer_value:e.string_value}),e.notes&&t.jsx("p",{className:"text-xs text-gray-600 italic print:text-xs print:leading-tight",children:e.notes})]},e.id))})})]}),n&&n.length>0&&t.jsxs(s,{className:"mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300",children:[t.jsx(p,{className:"bg-gradient-to-r from-blue-500 to-blue-600 text-white print:bg-gray-100 print:text-gray-900 print:py-2",children:t.jsxs(m,{className:"flex items-center gap-2 print:gap-1",children:[t.jsx("div",{className:"p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5",children:t.jsx(_,{className:"h-4 w-4 print:h-3 print:w-3"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-lg font-bold print:text-sm print:font-semibold",children:r("info_types.print.associated_info_title")}),t.jsxs("div",{className:"text-blue-100 text-xs print:text-gray-600 print:text-xs",children:[r("info_types.print.associated_info_description")," (",n.length," ",r("info_types.print.records_count"),")"]})]})]})}),t.jsx(o,{className:"p-4 print:p-2",children:t.jsx("div",{className:"space-y-3 print:space-y-1",children:n.map(e=>t.jsxs("div",{className:"bg-white border border-gray-200 rounded-lg p-3 print:border-gray-300 print:shadow-none print:p-1",children:[t.jsxs("div",{className:"flex items-start justify-between mb-2 print:mb-1",children:[t.jsxs("div",{className:"flex-1",children:[t.jsx("h3",{className:"text-base font-semibold text-gray-900 mb-1 print:text-sm print:font-medium",children:e.name||"Untitled"}),t.jsxs("div",{className:"flex items-center gap-3 text-xs text-gray-600 print:text-xs print:gap-2",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(w,{className:"h-3 w-3 print:h-2 print:w-2"}),a(e.created_at)]}),e.info_category&&e.info_category.name&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(l,{className:"h-3 w-3 print:h-2 print:w-2"}),e.info_category.name]}),e.code&&t.jsx("div",{className:"flex items-center gap-1",children:t.jsx("span",{className:"text-xs bg-gray-100 px-1 py-0.5 rounded print:text-xs print:px-0.5 print:py-0",children:e.code})})]})]}),t.jsx("div",{className:"ml-2 print:ml-1",children:c(e.confirmed)})]}),t.jsx("div",{className:"text-gray-700 print:text-xs",children:t.jsx("p",{className:"line-clamp-2 print:line-clamp-none print:leading-tight",children:e.description||"No description available"})})]},e.id))})})]}),t.jsxs("div",{className:"text-center text-gray-500 text-xs print:text-xs mt-4 print:mt-2 border-t border-gray-200 pt-2 print:border-gray-300 print:pt-1",children:[t.jsx("p",{children:r("info_types.print.footer_text")}),t.jsxs("p",{className:"mt-0.5 print:mt-0",children:[r("info_types.print.generated_by"),": ",r("app.name")]})]})]}),t.jsx("style",{children:`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            font-size: 10px;
            line-height: 1.2;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:p-1 {
            padding: 0.25rem !important;
          }
          
          .print\\:p-2 {
            padding: 0.5rem !important;
          }
          
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:mb-1 {
            margin-bottom: 0.25rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:mb-3 {
            margin-bottom: 0.75rem !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          
          .print\\:mt-1 {
            margin-top: 0.25rem !important;
          }
          
          .print\\:mt-2 {
            margin-top: 0.5rem !important;
          }
          
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:pt-1 {
            padding-top: 0.25rem !important;
          }
          
          .print\\:pb-2 {
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:gap-1 {
            gap: 0.25rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          
          .print\\:space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.75rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.625rem !important;
          }
          
          .print\\:font-medium {
            font-weight: 500 !important;
          }
          
          .print\\:font-semibold {
            font-weight: 600 !important;
          }
          
          .print\\:leading-tight {
            line-height: 1.1 !important;
          }
          
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .print\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border {
            border-width: 1px !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
          }
          
          .print\\:bg-white {
            background-color: #ffffff !important;
          }
          
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          
          .print\\:line-clamp-none {
            -webkit-line-clamp: unset !important;
            display: block !important;
          }
          
          .print\\:h-2 {
            height: 0.5rem !important;
          }
          
          .print\\:w-2 {
            width: 0.5rem !important;
          }
          
          .print\\:h-3 {
            height: 0.75rem !important;
          }
          
          .print\\:w-3 {
            width: 0.75rem !important;
          }
          
          .print\\:h-4 {
            height: 1rem !important;
          }
          
          .print\\:w-4 {
            width: 1rem !important;
          }
          
          .print\\:px-0\\.5 {
            padding-left: 0.125rem !important;
            padding-right: 0.125rem !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:p-0\\.5 {
            padding: 0.125rem !important;
          }
          
          .print\\:mb-0\\.5 {
            margin-bottom: 0.125rem !important;
          }
          
          .print\\:mt-0\\.5 {
            margin-top: 0.125rem !important;
          }
          
          .print\\:ml-1 {
            margin-left: 0.25rem !important;
          }
          
          .print\\:w-1\\.5 {
            width: 0.375rem !important;
          }
          
          .print\\:h-1\\.5 {
            height: 0.375rem !important;
          }
        }
      `})]})}export{R as default};
