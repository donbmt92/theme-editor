// Helper function to scroll preview to a specific section
export function scrollToPreviewSection(sectionId: string) {
    const previewElement = document.getElementById(sectionId)
    if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}

// Section IDs for Product Page
export const SECTION_IDS = {
    HERO: 'product-hero-section',
    OVERVIEW: 'product-overview-section',
    FEATURES: 'product-features-section',
    SPECS: 'product-specs-section',
    APPLICATIONS: 'product-applications-section',
    CERTIFICATIONS: 'product-certifications-section',
    OEM: 'product-oem-section',
    PACKAGING: 'product-packaging-section',
    WHY_CHOOSE: 'product-why-choose-section',
    LEAD_MAGNET: 'product-lead-magnet-section',
    RFQ: 'product-rfq-section',
    CTA: 'product-cta-section',
}
