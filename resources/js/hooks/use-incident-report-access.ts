import { usePage } from '@inertiajs/react';

export function useIncidentReportAccess() {
  const { incidentReportAccess } = usePage().props as any;
  
  const access = incidentReportAccess || {};
  
  return {
    // Check if user can view incident reports (global access)
    canViewIncidentReports: access.canViewIncidentReports || false,
    
    // Check if user can create incident reports (global access)
    canCreateIncidentReports: access.canCreateIncidentReports || false,
    
    // Check if user can update incident reports (global access)
    canUpdateIncidentReports: access.canUpdateIncidentReports || false,
    
    // Check if user can delete incident reports (global access)
    canDeleteIncidentReports: access.canDeleteIncidentReports || false,
    
    // Check if user can access incidents only (global access)
    canAccessIncidentsOnly: access.canAccessIncidentsOnly || false,
    
    // Check if user has any incident report access (global access)
    hasIncidentReportAccess: access.hasIncidentReportAccess || false,
    
    // Get current access information (global access)
    currentAccess: access.currentAccess || null,
    
    // Report-specific access methods (for show page)
    canViewIncidentReport: access.canViewIncidentReport || false,
    canUpdateIncidentReport: access.canUpdateIncidentReport || false,
    canDeleteIncidentReport: access.canDeleteIncidentReport || false,
    canAccessIncidentsOnlyForReport: access.canAccessIncidentsOnlyForReport || false,
    hasIncidentReportAccessForReport: access.hasIncidentReportAccessForReport || false,
    
    // Helper method to check if user has full access (global)
    hasFullAccess: () => {
      return access.currentAccess?.access_type === 'full';
    },
    
    // Helper method to check if user has read-only access (global)
    hasReadOnlyAccess: () => {
      return access.currentAccess?.access_type === 'read_only' || 
             access.currentAccess?.access_type === 'full';
    },
    
    // Helper method to check if user has incidents-only access (global)
    hasIncidentsOnlyAccess: () => {
      return access.currentAccess?.access_type === 'incidents_only' || 
             access.currentAccess?.access_type === 'full';
    },
    
    // Helper method to check if access is expired (global)
    isAccessExpired: () => {
      if (!access.currentAccess?.expires_at) {
        return false;
      }
      return new Date(access.currentAccess.expires_at) < new Date();
    },
    
    // Helper method to check if access is active (global)
    isAccessActive: () => {
      return access.currentAccess?.is_active && !access.isAccessExpired?.();
    },

    // Helper method to check if current access is global
    isGlobalAccess: () => {
      return access.currentAccess?.is_global || access.currentAccess?.incident_report_id === null;
    },

    // Helper method to check if current access is report-specific
    isReportSpecificAccess: () => {
      return !access.isGlobalAccess();
    },

    // Helper method to get the report ID for current access
    getCurrentReportId: () => {
      return access.currentAccess?.incident_report_id;
    },

    // Helper method to check if current access is report-specific (for show page)
    isReportSpecific: () => {
      return access.currentAccess?.is_report_specific || false;
    },
  };
}
