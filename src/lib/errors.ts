export type ErrorCategory =
  | 'INVALID_URL'
  | 'UNSUPPORTED_SCHEME'
  | 'PRIVATE_NETWORK_BLOCKED'
  | 'REMOTE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'ACCESS_BLOCKED'
  | 'IMAGE_INVALID'
  | 'IMAGE_TOO_LARGE'
  | 'EXTRACTION_FAILED'
  | 'AI_FAILED'
  | 'ZIP_FAILED'
  | 'UNKNOWN';

export interface AppError {
  category: ErrorCategory;
  title: string;
  message: string;
  suggestedAction: string;
  technicalDetails?: string;
}

export function formatError(category: ErrorCategory, details?: string): AppError {
  switch (category) {
    case 'INVALID_URL':
      return {
        category,
        title: 'Invalid Website URL',
        message: 'The URL entered could not be parsed as a valid web address.',
        suggestedAction: 'Please enter a complete URL including the scheme, e.g. https://example.com',
        technicalDetails: details,
      };
    case 'UNSUPPORTED_SCHEME':
      return {
        category,
        title: 'Unsupported Protocol',
        message: 'Only standard HTTP and HTTPS websites can be analyzed.',
        suggestedAction: 'Change the address to use https:// or http://.',
        technicalDetails: details,
      };
    case 'PRIVATE_NETWORK_BLOCKED':
      return {
        category,
        title: 'Restricted Address Blocked',
        message: 'Localhost, private subnets, and cloud metadata addresses are restricted for security.',
        suggestedAction: 'Please provide a publicly accessible website URL.',
        technicalDetails: details,
      };
    case 'REMOTE_UNAVAILABLE':
      return {
        category,
        title: 'Remote Browser Worker Unavailable',
        message: 'The remote headless browser service could not be reached or has not been configured.',
        suggestedAction: 'Please ensure the inspection service is running and retry.',
        technicalDetails: details,
      };
    case 'TIMEOUT':
      return {
        category,
        title: 'Website Timed Out',
        message: 'The remote website took too long to load or did not respond in time.',
        suggestedAction: 'Please verify the website URL is accessible and try again.',
        technicalDetails: details,
      };
    case 'ACCESS_BLOCKED':
      return {
        category,
        title: 'Automated Access Restricted',
        message: 'The destination website blocks automated browser inspection or requires authentication.',
        suggestedAction: 'Please verify the website is publicly accessible or try an alternative URL.',
        technicalDetails: details,
      };
    case 'IMAGE_INVALID':
      return {
        category,
        title: 'Unsupported Screenshot Format',
        message: 'The uploaded file is not a supported image format.',
        suggestedAction: 'Please upload a PNG, JPEG, or WebP screenshot image file.',
        technicalDetails: details,
      };
    case 'IMAGE_TOO_LARGE':
      return {
        category,
        title: 'Screenshot File Too Large',
        message: 'The uploaded image exceeds the maximum supported limit (10 MB).',
        suggestedAction: 'Please compress or crop the screenshot before uploading.',
        technicalDetails: details,
      };
    case 'EXTRACTION_FAILED':
      return {
        category,
        title: 'Analysis Extraction Incomplete',
        message: 'Could not extract sufficient visual cues from the provided input.',
        suggestedAction: 'Ensure the image is sharp or provide a direct page URL.',
        technicalDetails: details,
      };
    case 'AI_FAILED':
      return {
        category,
        title: 'AI Enhancement Unavailable',
        message: 'The optional AI inference provider was unreachable or rate-limited.',
        suggestedAction: 'Falling back gracefully to the deterministic rule-based analysis engine.',
        technicalDetails: details,
      };
    case 'ZIP_FAILED':
      return {
        category,
        title: 'Export Archive Failed',
        message: 'An error occurred while compiling the ZIP archive package.',
        suggestedAction: 'You can still copy or download the individual Markdown files directly.',
        technicalDetails: details,
      };
    default:
      return {
        category: 'UNKNOWN',
        title: 'Unexpected Issue',
        message: 'An unexpected issue occurred during the analysis workflow.',
        suggestedAction: 'Please check the console or try restarting the analysis.',
        technicalDetails: details,
      };
  }
}
