export interface ScormPlayerProps {
  scormUrl: string;
  contentId: string;
  studentId: string;
  onComplete?: () => void;
  onClose?: () => void;
}
