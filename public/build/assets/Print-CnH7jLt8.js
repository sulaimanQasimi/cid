import{r as b,j as t,L as h}from"./app-CbeKh3sQ.js";import{B as x}from"./button-vsEdbmui.js";import{C as l,a as o,b as p,d}from"./card-DRnQwPQj.js";import{B as j}from"./badge-BRzQMVqy.js";import{u as y}from"./translate-DDGPHNjD.js";import{a as f,f as N}from"./date-DxmwiI-o.js";import{A as u}from"./arrow-left-CumcE478.js";import{P as _}from"./printer-DVLVtHig.js";import{F as m}from"./file-text-C1z44-YN.js";import{C as v}from"./chart-column-ZTAypupu.js";import{D as w}from"./database-BoNrNW8a.js";import{C}from"./calendar-Cxk-Mvg8.js";import"./utils-Bb4HXjj7.js";import"./createLucideIcon-C8XIMENg.js";function U({infoType:s,infos:i,statCategories:k}){const{t:r}=y();b.useEffect(()=>{const e=setTimeout(()=>{window.print()},1e3);return()=>clearTimeout(e)},[]);const a=e=>N(e),g=e=>{const c={published:{bg:"bg-green-100",text:"text-green-800",border:"border-green-300"},draft:{bg:"bg-gray-100",text:"text-gray-800",border:"border-gray-300"},pending:{bg:"bg-yellow-100",text:"text-yellow-800",border:"border-yellow-300"}},n=c[e]||c.draft;return t.jsx(j,{variant:"outline",className:`px-3 py-1 rounded-lg font-semibold ${n.bg} ${n.text} ${n.border}`,children:e.charAt(0).toUpperCase()+e.slice(1)})};return t.jsxs(t.Fragment,{children:[t.jsx(h,{title:r("info_types.print.title",{name:s.name})}),t.jsx("div",{className:"print:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50",children:t.jsxs("div",{className:"container mx-auto flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs(x,{variant:"outline",onClick:()=>window.history.back(),className:"flex items-center gap-2",children:[t.jsx(u,{className:"h-4 w-4"}),r("info_types.print.back_button")]}),t.jsx("h1",{className:"text-xl font-semibold text-gray-800",children:r("info_types.print.page_title",{name:s.name})})]}),t.jsxs(x,{onClick:()=>window.print(),className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700",children:[t.jsx(_,{className:"h-4 w-4"}),r("info_types.print.print_button")]})]})}),t.jsxs("div",{className:"container mx-auto p-6 print:p-0 print:mx-0",children:[t.jsxs("div",{className:"text-center mb-8 print:mb-6",children:[t.jsxs("div",{className:"flex items-center justify-center gap-3 mb-4",children:[t.jsx("div",{className:"p-3 bg-purple-100 rounded-full",children:t.jsx(m,{className:"h-8 w-8 text-purple-600"})}),t.jsx("h1",{className:"text-3xl font-bold text-gray-900 print:text-2xl",children:s.name})]}),t.jsx("div",{className:"text-gray-600 text-lg print:text-base",children:r("info_types.print.report_title")}),t.jsxs("div",{className:"text-gray-500 text-sm print:text-xs mt-2",children:[r("info_types.print.generated_on"),": ",f(new Date().toISOString())]})]}),t.jsxs(l,{className:"mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300",children:[t.jsx(o,{className:"bg-gradient-to-r from-purple-500 to-purple-600 text-white print:bg-gray-100 print:text-gray-900",children:t.jsxs(p,{className:"flex items-center gap-3",children:[t.jsx("div",{className:"p-2 bg-white/20 rounded-lg print:bg-gray-200",children:t.jsx(m,{className:"h-5 w-5"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-xl font-bold print:text-lg",children:r("info_types.print.details_title")}),t.jsx("div",{className:"text-purple-100 text-sm print:text-gray-600",children:r("info_types.print.details_description")})]})]})}),t.jsx(d,{className:"p-6 print:p-4",children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4",children:[t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1 print:text-xs",children:r("info_types.print.name_label")}),t.jsx("p",{className:"text-lg font-bold text-gray-900 print:text-base",children:s.name})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1 print:text-xs",children:r("info_types.print.description_label")}),t.jsx("p",{className:"text-gray-800 print:text-sm",children:s.description||r("info_types.print.no_description")})]})]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1 print:text-xs",children:r("info_types.print.created_at_label")}),t.jsx("p",{className:"text-gray-800 print:text-sm",children:a(s.created_at)})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1 print:text-xs",children:r("info_types.print.updated_at_label")}),t.jsx("p",{className:"text-gray-800 print:text-sm",children:a(s.updated_at)})]}),s.creator&&t.jsxs("div",{children:[t.jsx("h3",{className:"text-sm font-semibold text-gray-700 mb-1 print:text-xs",children:r("info_types.print.created_by_label")}),t.jsx("p",{className:"text-gray-800 print:text-sm",children:s.creator.name})]})]})]})})]}),s.infoStats&&s.infoStats.length>0&&t.jsxs(l,{className:"mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300",children:[t.jsx(o,{className:"bg-gradient-to-r from-green-500 to-green-600 text-white print:bg-gray-100 print:text-gray-900",children:t.jsxs(p,{className:"flex items-center gap-3",children:[t.jsx("div",{className:"p-2 bg-white/20 rounded-lg print:bg-gray-200",children:t.jsx(v,{className:"h-5 w-5"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-xl font-bold print:text-lg",children:r("info_types.print.stats_title")}),t.jsx("div",{className:"text-green-100 text-sm print:text-gray-600",children:r("info_types.print.stats_description")})]})]})}),t.jsx(d,{className:"p-6 print:p-4",children:t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3",children:s.infoStats.map(e=>t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg print:bg-white print:border print:border-gray-200",children:[t.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.jsx("div",{className:"w-3 h-3 rounded-full",style:{backgroundColor:e.stat_category_item.category.color}}),t.jsx("span",{className:"text-sm font-medium text-gray-700 print:text-xs",children:e.stat_category_item.category.label})]}),t.jsx("h4",{className:"font-semibold text-gray-900 mb-1 print:text-sm",children:e.stat_category_item.label}),t.jsx("p",{className:"text-lg font-bold text-green-600 mb-2 print:text-base",children:e.integer_value!==null?e.integer_value:e.string_value}),e.notes&&t.jsx("p",{className:"text-sm text-gray-600 italic print:text-xs",children:e.notes})]},e.id))})})]}),i&&i.length>0&&t.jsxs(l,{className:"mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300",children:[t.jsx(o,{className:"bg-gradient-to-r from-blue-500 to-blue-600 text-white print:bg-gray-100 print:text-gray-900",children:t.jsxs(p,{className:"flex items-center gap-3",children:[t.jsx("div",{className:"p-2 bg-white/20 rounded-lg print:bg-gray-200",children:t.jsx(w,{className:"h-5 w-5"})}),t.jsxs("div",{children:[t.jsx("div",{className:"text-xl font-bold print:text-lg",children:r("info_types.print.associated_info_title")}),t.jsxs("div",{className:"text-blue-100 text-sm print:text-gray-600",children:[r("info_types.print.associated_info_description")," (",i.length," ",r("info_types.print.records_count"),")"]})]})]})}),t.jsx(d,{className:"p-6 print:p-4",children:t.jsx("div",{className:"space-y-4 print:space-y-3",children:i.map(e=>t.jsxs("div",{className:"bg-white border border-gray-200 rounded-lg p-4 print:border-gray-300 print:shadow-none",children:[t.jsxs("div",{className:"flex items-start justify-between mb-3",children:[t.jsxs("div",{className:"flex-1",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-1 print:text-base",children:e.title}),t.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-600 print:text-xs",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(C,{className:"h-4 w-4"}),a(e.created_at)]}),e.infoCategory&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(m,{className:"h-4 w-4"}),e.infoCategory.name]})]})]}),t.jsx("div",{className:"ml-4",children:g(e.status)})]}),t.jsx("div",{className:"text-gray-700 print:text-sm",children:t.jsx("p",{className:"line-clamp-3 print:line-clamp-none",children:e.content})})]},e.id))})})]}),t.jsxs("div",{className:"text-center text-gray-500 text-sm print:text-xs mt-8 print:mt-6 border-t border-gray-200 pt-4 print:border-gray-300",children:[t.jsx("p",{children:r("info_types.print.footer_text")}),t.jsxs("p",{className:"mt-1",children:[r("info_types.print.generated_by"),": ",r("app.name")]})]})]}),t.jsx("style",{children:`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          
          .print\\:p-4 {
            padding: 1rem !important;
          }
          
          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          
          .print\\:text-base {
            font-size: 1rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .print\\:gap-3 {
            gap: 0.75rem !important;
          }
          
          .print\\:gap-4 {
            gap: 1rem !important;
          }
          
          .print\\:space-y-3 > * + * {
            margin-top: 0.75rem !important;
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
        }
      `})]})}export{U as default};
