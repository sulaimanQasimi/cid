import{j as e,L as v}from"./app-BxHsUvSW.js";import{B as g}from"./button-D38DdR1I.js";import{B as a}from"./badge-C6rBbc3r.js";import{C as n,a as d,b as l,d as c}from"./card-DBRwickI.js";import{u as A}from"./translate-B9B3-WC_.js";import{L as U}from"./lock-D9Hf-tCh.js";import{A as _}from"./arrow-left-BIXcz2Yv.js";import{P as M}from"./printer-Cs5yRnKK.js";import{S as w,T as k}from"./triangle-alert-DBGhvrTH.js";import{F as b}from"./file-text-CSTJfcvu.js";import{C as P}from"./calendar-CpXcFC-k.js";import{f as m}from"./index-CaunA62S.js";import{C as G}from"./clock-T_g_TfsQ.js";import{U as C}from"./user-ckhpEBfj.js";import{U as H}from"./users-BA3lKmz2.js";import{B as O}from"./book-text-xohyufzc.js";import{G as D}from"./gavel-DqPmVgUw.js";import{F as B}from"./file-check-Dy0oExrh.js";import{M as E}from"./map-pin-KL4RdtRe.js";import{B as I}from"./building-2-Ewqq-w2n.js";import{C as R}from"./chart-bar-DvDVbDHu.js";import"./utils-in_Kv75F.js";import"./createLucideIcon-BhmMRbp7.js";function he({report:t,incidents:p,reportStats:V,statsByCategory:h,statCategories:q,barcodeData:o,isAdmin:z}){var N,y,u,f;const{t:s}=A(),S=()=>{window.print()},j=()=>{window.history.back()};function T(r){switch(r){case"closed":return e.jsx(a,{variant:"secondary",className:"bg-gray-500 text-white border-gray-600 px-2 py-1 text-xs font-medium rounded-lg",children:s("incidents.status.closed")});case"in_progress":return e.jsx(a,{variant:"default",className:"bg-blue-500 text-white border-blue-600 px-2 py-1 text-xs font-medium rounded-lg",children:s("incidents.status.in_progress")});default:return e.jsx(a,{variant:"outline",className:"bg-green-100 text-green-800 border-green-300 px-2 py-1 text-xs font-medium rounded-lg",children:r})}}function $(r){switch(r){case"high":return e.jsx(a,{variant:"destructive",className:"bg-red-500 text-white border-red-600 px-2 py-1 text-xs font-medium rounded-lg",children:r});case"medium":return e.jsx(a,{variant:"default",className:"bg-yellow-500 text-white border-yellow-600 px-2 py-1 text-xs font-medium rounded-lg",children:r});default:return e.jsx(a,{variant:"outline",className:"bg-green-100 text-green-800 border-green-300 px-2 py-1 text-xs font-medium rounded-lg",children:r})}}function F(r){return r.integer_value!==null?r.integer_value.toString():r.string_value||""}const L=`${o.report_number}|${o.report_id}|${o.date}|${o.security_level}`;return z?e.jsxs(e.Fragment,{children:[e.jsx(v,{title:s("incident_reports.print.page_title",{number:t.report_number})}),e.jsxs("div",{className:"print:hidden fixed top-4 right-4 z-50 flex gap-2",children:[e.jsxs(g,{onClick:j,variant:"outline",className:"bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg",children:[e.jsx(_,{className:"h-4 w-4 mr-2"}),s("common.back")]}),e.jsxs(g,{onClick:S,className:"bg-blue-600 hover:bg-blue-700 text-white shadow-lg",children:[e.jsx(M,{className:"h-4 w-4 mr-2"}),s("common.print")]})]}),e.jsxs("div",{className:"min-h-screen bg-white p-8 print:p-0 print:min-h-0",dir:"rtl",children:[e.jsxs("div",{className:"text-center mb-4 print:mb-3",children:[e.jsxs("div",{className:"flex items-center justify-center gap-3 mb-2",children:[e.jsx("div",{className:"p-2 bg-blue-100 rounded-full",children:e.jsx(w,{className:"h-6 w-6 text-blue-600"})}),e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:s("incident_reports.print.title")})]}),e.jsx("div",{className:"text-sm text-gray-600 mb-3",children:s("incident_reports.print.subtitle")}),e.jsxs("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block",children:[e.jsx("div",{className:"text-xs text-gray-500 mb-1",children:s("incident_reports.print.barcode_label")}),e.jsx("div",{className:"font-mono text-xs bg-white p-1 border border-gray-300 rounded",children:L}),e.jsx("div",{className:"text-xs text-gray-500 mt-1",children:s("incident_reports.print.barcode_info")})]})]}),e.jsx("div",{className:"mb-4 print:mb-3",children:e.jsxs(n,{className:"border border-gray-200 shadow-sm",children:[e.jsx(d,{className:"bg-blue-50 border-b border-gray-200 py-3",children:e.jsxs(l,{className:"flex items-center gap-2 text-base text-blue-900",children:[e.jsx(b,{className:"h-4 w-4"}),s("incident_reports.print.report_info")]})}),e.jsxs(c,{className:"p-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.report_number"),":",e.jsx(b,{className:"h-3 w-3"})]}),e.jsx("span",{className:"text-gray-900 font-bold text-base",children:t.report_number})]}),e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.report_date_label"),":",e.jsx(P,{className:"h-3 w-3"})]}),e.jsx("span",{className:"text-gray-900 text-sm",children:m(new Date(t.report_date),"PPP")})]}),e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.status"),":",e.jsx(G,{className:"h-3 w-3"})]}),e.jsx(a,{variant:"outline",className:"bg-blue-100 text-blue-800 border-blue-300 px-2 py-0.5 text-xs font-medium",children:s(`incident_reports.status.${t.report_status}`)})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.security_level"),":",e.jsx(w,{className:"h-3 w-3"})]}),e.jsx(a,{variant:"outline",className:"bg-green-100 text-green-800 border-green-300 px-2 py-0.5 text-xs font-medium",children:s(`incident_reports.level.${t.security_level}`)})]}),e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.submitted_by"),":",e.jsx(C,{className:"h-3 w-3"})]}),e.jsx("span",{className:"text-gray-900 text-sm",children:((N=t.submitter)==null?void 0:N.name)||s("incidents.unknown")})]}),t.approver&&e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-1",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.approved_by"),":",e.jsx(C,{className:"h-3 w-3"})]}),e.jsx("span",{className:"text-gray-900 text-sm",children:(y=t.approver)==null?void 0:y.name})]})]})]}),t.source&&e.jsx("div",{className:"mt-3 pt-3 border-t border-gray-200",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("span",{className:"font-semibold text-gray-700 flex items-center gap-1 text-sm",children:[s("incident_reports.show.source_label"),":",e.jsx(H,{className:"h-3 w-3"})]}),e.jsx("span",{className:"text-gray-900 text-sm",children:t.source})]})})]})]})}),e.jsx("div",{className:"mb-4 print:mb-3",children:e.jsxs(n,{className:"border border-gray-200 shadow-sm",children:[e.jsx(d,{className:"bg-green-50 border-b border-gray-200 py-3",children:e.jsxs(l,{className:"flex items-center gap-2 text-base text-green-900",children:[e.jsx(O,{className:"h-4 w-4"}),s("incident_reports.details.title")]})}),e.jsx(c,{className:"p-4",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"text-base font-semibold text-gray-700 mb-2 flex items-center gap-1",children:[s("incident_reports.details.details_label"),e.jsx(b,{className:"h-3 w-3"})]}),e.jsx("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:e.jsx("p",{className:"text-gray-900 whitespace-pre-wrap leading-relaxed text-sm",children:t.details})})]}),t.action_taken&&e.jsxs("div",{children:[e.jsxs("h3",{className:"text-base font-semibold text-gray-700 mb-2 flex items-center gap-1",children:[s("incident_reports.details.action_taken_label"),e.jsx(D,{className:"h-3 w-3"})]}),e.jsx("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:e.jsx("p",{className:"text-gray-900 whitespace-pre-wrap leading-relaxed text-sm",children:t.action_taken})})]}),t.recommendation&&e.jsxs("div",{children:[e.jsxs("h3",{className:"text-base font-semibold text-gray-700 mb-2 flex items-center gap-1",children:[s("incident_reports.details.recommendation_label"),e.jsx(B,{className:"h-3 w-3"})]}),e.jsx("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:e.jsx("p",{className:"text-gray-900 whitespace-pre-wrap leading-relaxed text-sm",children:t.recommendation})})]})]})})]})}),e.jsx("div",{className:"mb-4 print:mb-3",children:e.jsxs(n,{className:"border border-gray-200 shadow-sm",children:[e.jsx(d,{className:"bg-red-50 border-b border-gray-200 py-3",children:e.jsxs(l,{className:"flex items-center gap-2 text-base text-red-900",children:[e.jsx(k,{className:"h-4 w-4"}),s("incidents.page_title")," (",p.length,")"]})}),e.jsx(c,{className:"p-4",children:p.length===0?e.jsxs("div",{className:"text-center py-4",children:[e.jsx(k,{className:"h-12 w-12 text-gray-400 mx-auto mb-2"}),e.jsx("p",{className:"text-gray-600 text-sm",children:s("incidents.no_incidents")})]}):e.jsx("div",{className:"space-y-3",children:p.map((r,x)=>e.jsxs("div",{className:"border border-gray-200 rounded-lg p-3 bg-gray-50",children:[e.jsxs("div",{className:"flex justify-between items-start mb-2",children:[e.jsxs("h4",{className:"text-base font-semibold text-gray-900",children:[x+1,". ",r.title]}),e.jsxs("div",{className:"flex gap-1",children:[$(r.severity),T(r.status)]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 text-xs",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(P,{className:"h-3 w-3 text-gray-500"}),e.jsx("span",{className:"text-gray-700",children:m(new Date(r.incident_date),"PPP")})]}),r.location&&e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(E,{className:"h-3 w-3 text-gray-500"}),e.jsx("span",{className:"text-gray-700",children:r.location})]}),r.district&&e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(I,{className:"h-3 w-3 text-gray-500"}),e.jsx("span",{className:"text-gray-700",children:r.district.name})]}),r.category&&e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"h-2 w-2 rounded-full",style:{backgroundColor:r.category.color}}),e.jsx("span",{className:"text-gray-700",children:r.category.name})]})]}),e.jsx("div",{className:"bg-white p-2 rounded border border-gray-200",children:e.jsx("p",{className:"text-gray-800 leading-relaxed text-sm",children:r.description})})]},r.id))})})]})}),Object.keys(h).length>0&&e.jsx("div",{className:"mb-4 print:mb-3",children:e.jsxs(n,{className:"border border-gray-200 shadow-sm",children:[e.jsx(d,{className:"bg-purple-50 border-b border-gray-200 py-3",children:e.jsxs(l,{className:"flex items-center gap-2 text-base text-purple-900",children:[e.jsx(R,{className:"h-4 w-4"}),s("incident_reports.stats.title")]})}),e.jsx(c,{className:"p-4",children:e.jsx("div",{className:"space-y-4",children:Object.entries(h).map(([r,x])=>e.jsxs("div",{className:"border border-gray-200 rounded-lg p-3",children:[e.jsxs("h3",{className:"text-base font-semibold text-gray-700 mb-3 flex items-center gap-1",children:[e.jsx("div",{className:"h-3 w-3 rounded-full",style:{backgroundColor:x.category.color}}),r]}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:x.stats.map(i=>e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-100 pb-1",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("div",{className:"h-2 w-2 rounded-full",style:{backgroundColor:i.stat_category_item.color||i.stat_category_item.category.color}}),e.jsx("span",{className:"text-gray-700 font-medium text-sm",children:i.stat_category_item.label})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-gray-900 font-semibold text-sm",children:F(i)}),i.notes&&e.jsx("div",{className:"text-xs text-gray-500 mt-0.5",children:i.notes})]})]},i.id))})]},r))})})]})}),e.jsx("div",{className:"mb-4 print:mb-3",children:e.jsxs(n,{className:"border border-gray-200 shadow-sm",children:[e.jsx(d,{className:"bg-gray-50 border-b border-gray-200 py-3",children:e.jsxs(l,{className:"flex items-center gap-2 text-base text-gray-900",children:[e.jsx(B,{className:"h-4 w-4"}),s("incident_reports.print.approval_section")]})}),e.jsxs(c,{className:"p-4",children:[e.jsxs("div",{className:"grid grid-cols-1 print:grid-cols-2 gap-6",children:[e.jsx("div",{className:"text-center",children:e.jsxs("div",{className:"border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center",children:[e.jsx("div",{className:"text-xs text-gray-500 mb-1",children:s("incident_reports.print.official_stamp")}),e.jsx("div",{className:"text-xs text-gray-400",children:s("incident_reports.print.stamp_placeholder")})]})}),e.jsx("div",{className:"text-center",children:e.jsxs("div",{className:"border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex flex-col items-center justify-center",children:[e.jsx("div",{className:"text-xs text-gray-500 mb-1",children:s("incident_reports.print.authorized_signature")}),e.jsx("div",{className:"text-xs text-gray-400",children:s("incident_reports.print.signature_placeholder")})]})})]}),e.jsxs("div",{className:"mt-4 grid grid-cols-1 print:grid-cols-3 gap-3 text-center",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-700 mb-1",children:s("incident_reports.print.approved_by")}),e.jsx("div",{className:"text-xs text-gray-500 border-t border-gray-200 pt-1",children:((u=t.approver)==null?void 0:u.name)||s("incident_reports.print.pending_approval")})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-700 mb-1",children:s("incident_reports.print.approval_date")}),e.jsx("div",{className:"text-xs text-gray-500 border-t border-gray-200 pt-1",children:t.approver?m(new Date(t.updated_at),"PPP"):s("incident_reports.print.pending")})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-700 mb-1",children:s("incident_reports.print.document_status")}),e.jsx("div",{className:"text-xs text-gray-500 border-t border-gray-200 pt-1",children:s(`incident_reports.status.${t.report_status}`)})]})]})]})]})}),e.jsx("div",{className:"mt-8 print:mt-6 pt-6 border-t-2 border-gray-300",children:e.jsxs("div",{className:"grid grid-cols-1 print:grid-cols-3 gap-4 text-center",children:[e.jsxs("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:[e.jsx("div",{className:"text-sm font-semibold text-gray-700 mb-2",children:s("incident_reports.print.generated_by")}),e.jsx("div",{className:"text-sm text-gray-900 font-medium",children:((f=t.submitter)==null?void 0:f.name)||s("incidents.unknown")})]}),e.jsxs("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:[e.jsx("div",{className:"text-sm font-semibold text-gray-700 mb-2",children:s("incident_reports.print.generated_date")}),e.jsx("div",{className:"text-sm text-gray-900 font-medium",children:m(new Date(t.created_at),"PPP")})]}),e.jsxs("div",{className:"bg-gray-50 p-3 rounded-lg border border-gray-200",children:[e.jsx("div",{className:"text-sm font-semibold text-gray-700 mb-2",children:s("incident_reports.print.last_updated")}),e.jsx("div",{className:"text-sm text-gray-900 font-medium",children:m(new Date(t.updated_at),"PPP")})]})]})})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              font-size: 10pt;
              line-height: 1.2;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:mb-3 {
              margin-bottom: 0.75rem !important;
            }
            
            .print\\:mb-6 {
              margin-bottom: 1.5rem !important;
            }
            
            .print\\:mt-6 {
              margin-top: 1.5rem !important;
            }
            
            .print\\:mt-8 {
              margin-top: 2rem !important;
            }
            
            .print\\:p-0 {
              padding: 0 !important;
            }
            
            .print\\:min-h-0 {
              min-height: 0 !important;
            }
            
            h1 {
              font-size: 18pt !important;
              margin-bottom: 0.5rem !important;
            }
            
            h2, h3, h4 {
              font-size: 12pt !important;
              margin-bottom: 0.25rem !important;
            }
            
            p {
              font-size: 10pt !important;
              margin-bottom: 0.25rem !important;
            }
            
            .text-sm {
              font-size: 9pt !important;
            }
            
            .text-xs {
              font-size: 8pt !important;
            }
            
            .p-4 {
              padding: 0.75rem !important;
            }
            
            .p-3 {
              padding: 0.5rem !important;
            }
            
            .p-2 {
              padding: 0.25rem !important;
            }
            
            .mb-4 {
              margin-bottom: 0.75rem !important;
            }
            
            .mb-3 {
              margin-bottom: 0.5rem !important;
            }
            
            .mb-2 {
              margin-bottom: 0.25rem !important;
            }
            
            .space-y-4 > * + * {
              margin-top: 0.75rem !important;
            }
            
            .space-y-3 > * + * {
              margin-top: 0.5rem !important;
            }
          }
        `}})]}):e.jsxs(e.Fragment,{children:[e.jsx(v,{title:s("incident_reports.print.access_denied")}),e.jsx("div",{className:"min-h-screen bg-white p-8 flex items-center justify-center",dir:"rtl",children:e.jsxs(n,{className:"border border-red-200 shadow-sm max-w-md",children:[e.jsx(d,{className:"bg-red-50 border-b border-red-200",children:e.jsxs(l,{className:"flex items-center gap-3 text-lg text-red-900",children:[e.jsx(U,{className:"h-5 w-5"}),s("incident_reports.print.access_denied")]})}),e.jsxs(c,{className:"p-6",children:[e.jsx("p",{className:"text-gray-700 mb-4",children:s("incident_reports.print.admin_only")}),e.jsxs(g,{onClick:j,variant:"outline",className:"w-full",children:[e.jsx(_,{className:"h-4 w-4 mr-2"}),s("common.back")]})]})]})})]})}export{he as default};
