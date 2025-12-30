import { useEffect, useState } from 'react';
import {
  addTourExclusion,
  addTourInclusion,
  addTourItinerary,
  createTour,
  deleteTour,
  deleteTourExclusion,
  deleteTourImage,
  deleteTourInclusion,
  deleteTourItinerary,
  fetchTourDetails,
  fetchTours,
  toMediaUrl,
  updateTour,
  uploadTourImage,
} from '../api/client';
import RichTextEditor from './RichTextEditor';

type Tour = {
  id: string;
  name: string;
  location?: string;
  price?: string;
  tagline?: string;
  description?: string;
  image?: string;
  duration?: string;
  rating?: number;
  popular?: boolean;
  reviews?: number;
  photos?: string[];
  included?: string[];
  excluded?: string[];
  plan?: Array<string | string[] | { day: string; activities: string[] }>;
};

type TourDetails = {
  inclusionIds: string[];
  exclusionIds: string[];
  itineraryIds: string[];
  imageIds: string[];
};

const MAX_TEXT_LENGTH = 80;
const DURATION_REGEX = /^([1-9]\d*\s+(hour|hours|day|days)|[1-9]\d*\s*-\s*[1-9]\d*\s+(day|days))$/i;

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Error Modal Component
const ErrorModal = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 text-red-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold">Error</h3>
      </div>
      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
      >
        Dismiss
      </button>
    </div>
  </div>
);

// Skeleton grid for tours
function TourCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function TourManager() {
  const [items, setItems] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Tour | null>(null);
  const [editingDetails, setEditingDetails] = useState<TourDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    price: '',
    tagline: '',
    description: '',
    image: '',
    duration: '',
    rating: '',
    popular: false as boolean,
    reviews: '',
    photos: '',
    included: '',
    excluded: '',
    plan: '',
  });

  const [formError, setFormError] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [planItems, setPlanItems] = useState<Array<{ day: string; activities: string[] }>>([]);

  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [currentActivity, setCurrentActivity] = useState('');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Duration state
  const [durationType, setDurationType] = useState<'hours' | 'days' | 'day-range'>('hours');
  const [durationValue, setDurationValue] = useState('');
  const [durationRangeStart, setDurationRangeStart] = useState('');
  const [durationRangeEnd, setDurationRangeEnd] = useState('');

  const isValidDuration = (value: string) => DURATION_REGEX.test(value.trim());

  // Build duration string from separate inputs
  const buildDurationString = (): string => {
    if (durationType === 'hours') {
      const val = parseInt(durationValue);
      if (!val || val <= 0) return '';
      return `${val} ${val === 1 ? 'hour' : 'hours'}`;
    } else if (durationType === 'days') {
      const val = parseInt(durationValue);
      if (!val || val <= 0) return '';
      return `${val} ${val === 1 ? 'day' : 'days'}`;
    } else if (durationType === 'day-range') {
      const start = parseInt(durationRangeStart);
      const end = parseInt(durationRangeEnd);
      if (!start || !end || start <= 0 || end <= 0 || start >= end) return '';
      return `${start}-${end} days`;
    }
    return '';
  };

  // Parse duration string into separate inputs
  const parseDurationString = (duration: string) => {
    if (!duration) {
      setDurationType('hours');
      setDurationValue('');
      setDurationRangeStart('');
      setDurationRangeEnd('');
      return;
    }

    const rangeMatch = duration.match(/^(\d+)\s*-\s*(\d+)\s+(day|days)$/i);
    if (rangeMatch) {
      setDurationType('day-range');
      setDurationRangeStart(rangeMatch[1]);
      setDurationRangeEnd(rangeMatch[2]);
      setDurationValue('');
      return;
    }

    const singleMatch = duration.match(/^(\d+)\s+(hour|hours|day|days)$/i);
    if (singleMatch) {
      const unit = singleMatch[2].toLowerCase();
      if (unit.startsWith('hour')) {
        setDurationType('hours');
        setDurationValue(singleMatch[1]);
        setDurationRangeStart('');
        setDurationRangeEnd('');
      } else {
        setDurationType('days');
        setDurationValue(singleMatch[1]);
        setDurationRangeStart('');
        setDurationRangeEnd('');
      }
      return;
    }

    // Default fallback
    setDurationType('hours');
    setDurationValue('');
    setDurationRangeStart('');
    setDurationRangeEnd('');
  };

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const totalPhotos = photoFiles.length + photoUrls.length;

    if (totalPhotos + files.length > 10) {
      setFormError(`You can only add ${10 - totalPhotos} more photo(s). Maximum 10 photos allowed.`);
      e.target.value = '';
      return;
    }

    const filesToProcess = Array.from(files);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of filesToProcess) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormError(`Invalid file type: ${file.name}. Please upload JPG, PNG, WEBP, or GIF images.`);
        e.target.value = '';
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFormError(`File too large: ${file.name}. Maximum size is 10MB.`);
        e.target.value = '';
        return;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setPhotoFiles((prev) => [...prev, ...validFiles]);
      setPhotoUrls((prev) => [...prev, ...newPreviewUrls]);
      setFormError('');
    }

    e.target.value = '';
  };

  const loadTours = async () => {
    setLoading(true);
    try {
      const res = await fetchTours();
      const mapped = (res.items || []).map((tour: any) => ({
        id: tour._id,
        name: tour.name,
        location: tour.location,
        price: tour.price ? `$${tour.price}` : '',
        tagline: tour.tagline || '',
        description: tour.description,
        image: tour.imageUrl ? toMediaUrl(tour.imageUrl) : '',
        duration: tour.duration ? String(tour.duration) : '',
        rating: tour.rating,
        popular: tour.isHotDeal,
        reviews: tour.reviewsCount,
      }));
      setItems(mapped);
    } catch (err) {
      console.error('CollectionManager: failed to load tours', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const addPhotoFromUrl = () => {
    const url = urlInput.trim();

    if (!url) {
      setFormError('Please enter an image URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setFormError('Invalid URL format. Please enter a valid image URL.');
      return;
    }

    const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i;
    const isImageUrl = imageExtensions.test(url) || url.startsWith('data:image/');

    if (!isImageUrl) {
      setFormError('URL does not appear to be an image. Please use a direct image link.');
      return;
    }

    const totalPhotos = photoFiles.length + photoUrls.length;
    if (totalPhotos >= 10) {
      setFormError('Maximum 10 photos allowed per tour.');
      return;
    }

    setPhotoUrls((prev) => [...prev, url]);
    setUrlInput('');
    setFormError('');
  };

  const removePhoto = (index: number) => {
    const totalFiles = photoFiles.length;

    if (index < totalFiles) {
      const urlToRevoke = photoUrls[index];
      if (urlToRevoke && urlToRevoke.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRevoke);
      }
      setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
      setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const urlIndex = index - totalFiles;
      setPhotoUrls((prev) => prev.filter((_, i) => i !== urlIndex + totalFiles));
    }

    setFormError('');
  };

  const addIncludedItem = () => {
    const value = includedInput.trim();
    if (!value) return;
    if (value.length > MAX_TEXT_LENGTH) {
      setFormError(`Included items must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    setIncludedItems([...includedItems, value]);
    setIncludedInput('');
    setFormError('');
  };

  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const addExcludedItem = () => {
    const value = excludedInput.trim();
    if (!value) return;
    if (value.length > MAX_TEXT_LENGTH) {
      setFormError(`Excluded items must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    setExcludedItems([...excludedItems, value]);
    setExcludedInput('');
    setFormError('');
  };

  const removeExcludedItem = (index: number) => {
    setExcludedItems(excludedItems.filter((_, i) => i !== index));
  };

  const addActivityToDay = () => {
    if (!currentDay.trim() || !currentActivity.trim()) return;

    const existingDayIndex = planItems.findIndex((p) => p.day.toLowerCase() === currentDay.trim().toLowerCase());

    if (existingDayIndex >= 0) {
      const updated = [...planItems];
      updated[existingDayIndex].activities.push(currentActivity.trim());
      setPlanItems(updated);
    } else {
      setPlanItems([...planItems, { day: currentDay.trim(), activities: [currentActivity.trim()] }]);
    }

    setCurrentActivity('');
  };

  const removeDay = (index: number) => {
    setPlanItems(planItems.filter((_, i) => i !== index));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...planItems];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== activityIndex);

    if (updated[dayIndex].activities.length === 0) {
      updated.splice(dayIndex, 1);
    }

    setPlanItems(updated);
  };

  const toggleDayExpanded = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) newExpanded.delete(index);
    else newExpanded.add(index);
    setExpandedDays(newExpanded);
  };

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setForm({ ...form, price: formatted });
  };

  const openAddModal = () => {
    setEditing(null);
    setEditingDetails(null);
    setForm({
      name: '',
      location: '',
      price: '',
      tagline: '',
      description: '',
      image: '',
      duration: '',
      rating: '',
      popular: false,
      reviews: '',
      photos: '',
      included: '',
      excluded: '',
      plan: '',
    });
    setFormError('');
    setUrlInput('');
    setIncludedItems([]);
    setExcludedItems([]);
    setPlanItems([]);
    setIncludedInput('');
    setExcludedInput('');
    setCurrentDay('');
    setCurrentActivity('');
    setExpandedDays(new Set());
    setPhotoFiles([]);
    setPhotoUrls([]);
    setDurationType('hours');
    setDurationValue('');
    setDurationRangeStart('');
    setDurationRangeEnd('');
    setShowModal(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields: string[] = [];
    if (!form.name.trim()) missingFields.push('Tour Name');
    if (!form.location.trim()) missingFields.push('Location');
    if (!form.price || Number(form.price) <= 0) missingFields.push('Price');

    const builtDuration = buildDurationString();
    if (!builtDuration) missingFields.push('Duration');

    if (!form.tagline.trim()) missingFields.push('Tagline');
    if (!form.description.trim()) missingFields.push('Description');

    const totalPhotos = photoFiles.length + photoUrls.length;
    if (totalPhotos === 0) missingFields.push('Tour Photos (at least 1 required)');

    if (missingFields.length > 0) {
      setFormError('');
      setError(`Please provide the following mandatory fields:\n\n• ${missingFields.join('\n• ')}`);
      return;
    }

    if (form.name.trim().length > MAX_TEXT_LENGTH || form.location.trim().length > MAX_TEXT_LENGTH) {
      setError(`Tour name and location must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    const safeRating = Math.min(Math.max(form.rating ? parseFloat(form.rating) : 0, 0), 4.9);

    setIsSaving(true);
    try {
      const created = await createTour({
        name: form.name,
        location: form.location,
        price: Number(form.price) || 0,
        duration: builtDuration,
        rating: safeRating,
        reviewsCount: form.reviews ? Number(form.reviews) : 0,
        isHotDeal: !!form.popular,
        tagline: form.tagline,
        description: form.description,
      });

      const tourId = created._id;

      for (const file of photoFiles) {
        await uploadTourImage(tourId, file, undefined);
      }

      const urlOnly = photoUrls.slice(photoFiles.length);
      for (const url of urlOnly) {
        await uploadTourImage(tourId, undefined, url);
      }

      for (const item of includedItems) {
        await addTourInclusion(tourId, item);
      }

      for (const item of excludedItems) {
        await addTourExclusion(tourId, item);
      }

      if (planItems.length > 0) {
        for (let index = 0; index < planItems.length; index += 1) {
          const day = planItems[index];
          const dayNumber = Number(day.day.match(/(\d+)/)?.[1]) || index + 1;
          for (const activity of day.activities) {
            await addTourItinerary(tourId, dayNumber, activity);
          }
        }
      }

      photoUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });

      await loadTours();

      setForm({
        name: '',
        location: '',
        price: '',
        tagline: '',
        description: '',
        image: '',
        duration: '',
        rating: '',
        popular: false,
        reviews: '',
        photos: '',
        included: '',
        excluded: '',
        plan: '',
      });
      setFormError('');
      setUrlInput('');
      setIncludedItems([]);
      setExcludedItems([]);
      setPlanItems([]);
      setExpandedDays(new Set());
      setPhotoFiles([]);
      setPhotoUrls([]);
      setDurationType('hours');
      setDurationValue('');
      setDurationRangeStart('');
      setDurationRangeEnd('');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create tour', err);
      const axiosErr = err as any;
      const apiErrors = axiosErr?.response?.data?.errors;
      const apiMessage = axiosErr?.response?.data?.message;
      let friendly = 'Unable to create tour. Please check your details.';

      if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
        const formattedErrors = apiErrors.map((e2: any) => {
          const field = e2.path || e2.param;
          return field ? `${field.charAt(0).toUpperCase() + field.slice(1)}: ${e2.msg}` : e2.msg;
        });
        friendly = `Backend Validation Failed:\n\n• ${formattedErrors.join('\n• ')}`;
      } else if (apiMessage) {
        friendly = apiMessage;
      }

      setFormError('');
      setError(friendly);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = async (t: Tour) => {
    setEditing(t);
    setEditingDetails(null);

    const priceValue = t.price ? t.price.replace(/[$,]/g, '') : '';

    try {
      const detail = await fetchTourDetails(t.id);
      const imageUrls =
        detail.images?.map((img: any) => toMediaUrl(img.imageUrl)).filter(Boolean) || [];

      setForm({
        name: detail.tour.name,
        location: detail.tour.location || '',
        price: detail.tour.price ? String(detail.tour.price) : priceValue,
        tagline: detail.tour.tagline || '',
        description: detail.tour.description || '',
        image: '',
        duration: detail.tour.duration ? String(detail.tour.duration) : '',
        rating: detail.tour.rating ? String(detail.tour.rating) : '',
        popular: !!detail.tour.isHotDeal,
        reviews: detail.tour.reviewsCount ? String(detail.tour.reviewsCount) : '',
        photos: '',
        included: '',
        excluded: '',
        plan: '',
      });

      setPhotoFiles([]);
      setPhotoUrls(imageUrls);

      setIncludedItems(detail.inclusions?.map((item: any) => item.description) || []);
      setExcludedItems(detail.exclusions?.map((item: any) => item.description) || []);

      if (detail.itinerary && detail.itinerary.length > 0) {
        const grouped = detail.itinerary.reduce((acc: Record<string, string[]>, item: any) => {
          const dayKey = `Day ${item.dayNumber}`;
          acc[dayKey] = acc[dayKey] || [];
          acc[dayKey].push(item.activity);
          return acc;
        }, {});
        const parsed = Object.entries(grouped).map(([day, activities]) => ({ day, activities }));
        setPlanItems(parsed);
        setExpandedDays(new Set(parsed.map((_, idx) => idx)));
      } else {
        setPlanItems([]);
        setExpandedDays(new Set());
      }

      setEditingDetails({
        inclusionIds: detail.inclusions?.map((item: any) => item._id) || [],
        exclusionIds: detail.exclusions?.map((item: any) => item._id) || [],
        itineraryIds: detail.itinerary?.map((item: any) => item._id) || [],
        imageIds: detail.images?.map((item: any) => item._id) || [],
      });

      // Parse duration into separate inputs
      parseDurationString(detail.tour.duration || '');
    } catch (err) {
      console.error('Failed to load tour details', err);
      setForm({
        name: t.name,
        location: t.location || '',
        price: priceValue,
        tagline: t.tagline || '',
        description: t.description || '',
        image: t.image || '',
        duration: t.duration || '',
        rating: t.rating ? String(t.rating) : '',
        popular: !!t.popular,
        reviews: t.reviews ? String(t.reviews) : '',
        photos: '',
        included: '',
        excluded: '',
        plan: '',
      });
      setPhotoFiles([]);
      setPhotoUrls([]);

      // Parse duration for fallback case too
      parseDurationString(t.duration || '');
    }

    setFormError('');
    setUrlInput('');
    setIncludedInput('');
    setExcludedInput('');
    setCurrentDay('');
    setCurrentActivity('');
    setShowModal(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const missingFields: string[] = [];
    if (!form.name.trim()) missingFields.push('Tour Name');
    if (!form.location.trim()) missingFields.push('Location');
    if (!form.price || Number(form.price) <= 0) missingFields.push('Price');

    const builtDuration = buildDurationString();
    if (!builtDuration) missingFields.push('Duration');

    if (!form.tagline.trim()) missingFields.push('Tagline');
    if (!form.description.trim()) missingFields.push('Description');

    const totalPhotos = photoFiles.length + photoUrls.length;
    if (totalPhotos === 0) missingFields.push('Tour Photos (at least 1 required)');

    if (missingFields.length > 0) {
      setFormError('');
      setError(`Please provide the following mandatory fields:\n\n• ${missingFields.join('\n• ')}`);
      return;
    }

    if (form.name.trim().length > MAX_TEXT_LENGTH || form.location.trim().length > MAX_TEXT_LENGTH) {
      setError(`Tour name and location must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    const safeRating = Math.min(Math.max(form.rating ? parseFloat(form.rating) : 0, 0), 4.9);

    try {
      setIsSaving(true);
      await updateTour(editing.id, {
        name: form.name,
        location: form.location,
        price: Number(form.price) || 0,
        duration: builtDuration,
        rating: safeRating,
        reviewsCount: form.reviews ? Number(form.reviews) : 0,
        isHotDeal: !!form.popular,
        tagline: form.tagline,
        description: form.description,
      });

      if (editingDetails) {
        for (const id of editingDetails.inclusionIds) await deleteTourInclusion(editing.id, id);
        for (const id of editingDetails.exclusionIds) await deleteTourExclusion(editing.id, id);
        for (const id of editingDetails.itineraryIds) await deleteTourItinerary(editing.id, id);
        for (const id of editingDetails.imageIds) await deleteTourImage(editing.id, id);
      }

      for (const file of photoFiles) {
        await uploadTourImage(editing.id, file, undefined);
      }

      const urlOnly = photoUrls.slice(photoFiles.length);
      for (const url of urlOnly) {
        await uploadTourImage(editing.id, undefined, url);
      }

      for (const item of includedItems) {
        await addTourInclusion(editing.id, item);
      }
      for (const item of excludedItems) {
        await addTourExclusion(editing.id, item);
      }

      if (planItems.length > 0) {
        for (let index = 0; index < planItems.length; index += 1) {
          const day = planItems[index];
          const dayNumber = Number(day.day.match(/(\d+)/)?.[1]) || index + 1;
          for (const activity of day.activities) {
            await addTourItinerary(editing.id, dayNumber, activity);
          }
        }
      }

      photoUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });

      await loadTours();

      setEditing(null);
      setEditingDetails(null);
      setForm({
        name: '',
        location: '',
        price: '',
        tagline: '',
        description: '',
        image: '',
        duration: '',
        rating: '',
        popular: false,
        reviews: '',
        photos: '',
        included: '',
        excluded: '',
        plan: '',
      });
      setFormError('');
      setUrlInput('');
      setIncludedItems([]);
      setExcludedItems([]);
      setPlanItems([]);
      setExpandedDays(new Set());
      setPhotoFiles([]);
      setPhotoUrls([]);
      setDurationType('hours');
      setDurationValue('');
      setDurationRangeStart('');
      setDurationRangeEnd('');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update tour', err);
      const axiosErr = err as any;
      const apiErrors = axiosErr?.response?.data?.errors;
      const apiMessage = axiosErr?.response?.data?.message;
      let friendly = 'Unable to update tour. Please check your details.';

      if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
        const formattedErrors = apiErrors.map((e2: any) => {
          const field = e2.path || e2.param;
          return field ? `${field.charAt(0).toUpperCase() + field.slice(1)}: ${e2.msg}` : e2.msg;
        });
        friendly = `Backend Validation Failed:\n\n• ${formattedErrors.join('\n• ')}`;
      } else if (apiMessage) {
        friendly = apiMessage;
      }

      setFormError('');
      setError(friendly);
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    photoUrls.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });

    setShowModal(false);
    setError(null);
    setEditing(null);
    setEditingDetails(null);
    setForm({
      name: '',
      location: '',
      price: '',
      tagline: '',
      description: '',
      image: '',
      duration: '',
      rating: '',
      popular: false,
      reviews: '',
      photos: '',
      included: '',
      excluded: '',
      plan: '',
    });
    setUrlInput('');
    setIncludedItems([]);
    setExcludedItems([]);
    setPlanItems([]);
    setExpandedDays(new Set());
    setPhotoFiles([]);
    setPhotoUrls([]);
    setDurationType('hours');
    setDurationValue('');
    setDurationRangeStart('');
    setDurationRangeEnd('');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tour?')) return;
    try {
      await deleteTour(id);
      setItems((s) => s.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to delete tour', err);
      setFormError('Unable to delete tour.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tours Manager</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage your tour packages and experiences - {items.length}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
          type="button"
        >
          <PlusIcon />
          <span>Add Tour</span>
        </button>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <TourCardSkeletonGrid count={6} />
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-400">
              <MapIcon />
            </div>
            <p className="text-gray-600 mb-4">No tours available yet</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Create your first tour
            </button>
          </div>
        ) : (
          items.map((i) => (
            <div
              key={i.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {i.image ? (
                  <img src={i.image} alt="tour" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">
                    <ImageIcon />
                  </div>
                )}
                {i.popular && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>HOT</span>
                  </div>
                )}
                {i.rating && (
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <StarIcon />
                    <span className="text-sm font-semibold">{i.rating}</span>
                  </div>
                )}
                {i.reviews != null && (
                  <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-lg shadow-md text-sm font-medium">
                    {i.reviews} reviews
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{i.name}</h3>

                <div className="space-y-2 mb-4">
                  {i.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <LocationIcon />
                      <span>{i.location}</span>
                    </div>
                  )}
                  {i.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon />
                      <span>{i.duration}</span>
                    </div>
                  )}
                </div>

                {i.description && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{i.description}</p>}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {i.price && <span className="text-lg font-semibold text-blue-600">{i.price}</span>}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => startEdit(i)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                      type="button"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => remove(i.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                      type="button"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Edit Tour' : 'Create New Tour'}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {editing ? 'Update your tour details' : 'Add a new tour package to your collection'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Form */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={editing ? saveEdit : handleAdd} className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                        <span>
                          Tour Name <span className="text-red-500">*</span>
                        </span>
                        <span className="text-xs text-gray-400">{form.name.length}/{MAX_TEXT_LENGTH}</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        maxLength={MAX_TEXT_LENGTH}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Paris City Tour"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                        <span>
                          Location (City) <span className="text-red-500">*</span>
                        </span>
                        <span className="text-xs text-gray-400">{form.location.length}/{15}</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <LocationIcon />
                        </div>
                        <input
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          maxLength={15}
                          className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Paris, France"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 font-semibold">
                          $
                        </div>
                        <input
                          value={form.price}
                          onChange={handlePriceChange}
                          className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="150.00"
                          type="text"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Duration Type Selector */}
                      <div className="mb-3">
                        <select
                          value={durationType}
                          onChange={(e) => {
                            setDurationType(e.target.value as 'hours' | 'days' | 'day-range');
                            setDurationValue('');
                            setDurationRangeStart('');
                            setDurationRangeEnd('');
                          }}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="day-range">Day Range</option>
                        </select>
                      </div>

                      {/* Duration Value Inputs */}
                      {durationType === 'day-range' ? (
                        <div className="flex gap-3 items-center">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={1}
                              value={durationRangeStart}
                              onChange={(e) => setDurationRangeStart(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="Start"
                              required
                            />
                          </div>
                          <span className="text-gray-400 font-semibold">to</span>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={1}
                              value={durationRangeEnd}
                              onChange={(e) => setDurationRangeEnd(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="End"
                              required
                            />
                          </div>
                          <span className="text-gray-600 font-medium">days</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <ClockIcon />
                          </div>
                          <input
                            type="number"
                            min={1}
                            value={durationValue}
                            onChange={(e) => setDurationValue(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={durationType === 'hours' ? 'e.g., 4' : 'e.g., 2'}
                            required
                          />
                        </div>
                      )}
                      
                      <p className="mt-2 text-xs text-gray-500">
                        {durationType === 'hours' && 'Single hours only (e.g., 4 hours)'}
                        {durationType === 'days' && 'Single days only (e.g., 2 days)'}
                        {durationType === 'day-range' && 'Range for days only (e.g., 2-5 days)'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-500">
                          <StarIcon />
                        </div>
                        <input
                          value={form.rating}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (Number(val) >= 0 && Number(val) <= 4.9)) {
                              setForm({ ...form, rating: val });
                            }
                          }}
                          className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="4.9"
                          type="number"
                          step="0.1"
                          min="0"
                          max="4.9"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="inline-flex items-center cursor-pointer px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <input
                          type="checkbox"
                          checked={!!form.popular}
                          onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                          className="form-checkbox h-5 w-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="ml-3 text-sm font-semibold text-gray-700"> Hot Deal</span>
                      </label>

                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reviews</label>
                        <input
                          type="number"
                          min={0}
                          value={form.reviews}
                          onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tagline <span className="text-red-500">*</span>
                      <span className={`ml-2 text-xs ${form.tagline.length > 80 ? 'text-red-500' : 'text-gray-400'}`}>
                        {form.tagline.length}/80
                      </span>
                    </label>
                    <input
                      value={form.tagline}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          setForm({ ...form, tagline: e.target.value });
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Short catchy phrase (max 80 chars)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description (Rich Text) <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={form.description}
                      onChange={(value) => setForm({ ...form, description: value })}
                      placeholder="Write a detailed tour description with formatting..."
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-100">
                   
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        Tour Photos <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-xs text-gray-500">Add 1-10 photos (at least 1 required)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-center gap-3 w-full border-3 border-dashed border-purple-300 rounded-xl px-6 py-5 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group">
                      <UploadIcon className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                          Upload from Device
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">JPG, PNG, WEBP, GIF up to 10MB (Max 10)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handlePhotoFile}
                        className="hidden"
                      />
                    </label>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <LinkIcon />
                        </div>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addPhotoFromUrl();
                            }
                          }}
                          className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Paste image URL here..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addPhotoFromUrl}
                        className="px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none  shadow-gray-200 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const totalPhotos = photoFiles.length + photoUrls.length;
                    return (
                      totalPhotos > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700">
                              {totalPhotos} {totalPhotos === 1 ? 'Photo' : 'Photos'} Added
                            </p>
                            <p className="text-xs text-gray-500">Remove any photo using X</p>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {photoFiles.map((file, idx) => {
                              const previewUrl = photoUrls[idx];
                              return (
                                <div key={`file-${idx}-${file.name}`} className="relative group">
                                  <div className="w-full aspect-square overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                                    {previewUrl ? (
                                      <img
                                        src={previewUrl}
                                        alt={`Photo ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="text-gray-400 text-xs text-center p-2">Loading...</div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removePhoto(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                                    title="Remove photo"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>

                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                                    #{idx + 1}
                                  </div>
                                </div>
                              );
                            })}

                            {photoUrls.slice(photoFiles.length).map((url, idx) => {
                              const displayIdx = photoFiles.length + idx;
                              return (
                                <div key={`url-${displayIdx}-${url.substring(0, 20)}`} className="relative group">
                                  <div className="w-full aspect-square overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                                    <img src={url} alt={`Photo ${displayIdx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removePhoto(displayIdx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110"
                                    title="Remove photo"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>

                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                                    #{displayIdx + 1}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    );
                  })()}

                  {formError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-red-700 font-medium">{formError}</span>
                    </div>
                  )}
                </div>

                {/* Included / Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        <CheckIcon />
                      </div>
                      <h4 className="font-semibold text-gray-900">What's Included</h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addIncludedItem();
                          }
                        }}
                        maxLength={MAX_TEXT_LENGTH}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="e.g., Professional guide"
                      />
                      <button
                        type="button"
                        onClick={addIncludedItem}
                        className="px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {includedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 group hover:bg-green-100 transition-colors"
                        >
                          <CheckIcon />
                          <span className="flex-1 text-sm text-gray-700">{item}</span>
                          <button
                            type="button"
                            onClick={() => removeIncludedItem(idx)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <XIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-red-100">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        <XIcon />
                      </div>
                      <h4 className="font-semibold text-gray-900">What's Excluded</h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={excludedInput}
                        onChange={(e) => setExcludedInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addExcludedItem();
                          }
                        }}
                        maxLength={MAX_TEXT_LENGTH}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="e.g., Flight tickets"
                      />
                      <button
                        type="button"
                        onClick={addExcludedItem}
                        className="px-4 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {excludedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 group hover:bg-red-100 transition-colors"
                        >
                          <XIcon />
                          <span className="flex-1 text-sm text-gray-700">{item}</span>
                          <button
                            type="button"
                            onClick={() => removeExcludedItem(idx)}
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-100">
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Tour Itinerary</h4>
                      <p className="text-xs text-gray-500">Plan activities for each day</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-xl p-5 space-y-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Select Day</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dayNum) => {
                          const dayName = `Day ${dayNum}`;
                          const isSelected = currentDay === dayName;
                          const hasActivities = planItems.some((p) => p.day === dayName);
                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => setCurrentDay(dayName)}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isSelected
                                ? 'bg-indigo-600 text-white shadow-md scale-105'
                                : hasActivities
                                  ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 border-2 border-indigo-300'
                                  : 'bg-white text-gray-700 hover:bg-indigo-100 border-2 border-gray-200'
                                }`}
                            >
                              {dayName}
                              {hasActivities && !isSelected && <span className="ml-1 text-xs">✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 items-center">
                        <input
                          value={currentDay}
                          onChange={(e) => setCurrentDay(e.target.value)}
                          className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                          placeholder="Or enter custom day (e.g., Day 11, Day 12)"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={currentActivity}
                        onChange={(e) => setCurrentActivity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addActivityToDay();
                          }
                        }}
                        className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        placeholder="Activity (e.g., Visit Eiffel Tower, Lunch at local restaurant)"
                      />
                      <button
                        type="button"
                        onClick={addActivityToDay}
                        disabled={!currentDay.trim() || !currentActivity.trim()}
                        className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon />
                        Add Activity
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {planItems.map((dayPlan, dayIdx) => (
                      <div key={dayIdx} className="border-2 border-indigo-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-5 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleDayExpanded(dayIdx)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 hover:bg-white/50 rounded-lg"
                            >
                              {expandedDays.has(dayIdx) ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </button>
                            <span className="font-bold text-indigo-900 text-lg">{dayPlan.day}</span>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-200 px-3 py-1 rounded-full">
                              {dayPlan.activities.length} {dayPlan.activities.length === 1 ? 'activity' : 'activities'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDay(dayIdx)}
                            className="text-red-500 hover:text-red-700 hover:bg-white/50 p-2 rounded-lg transition-all"
                            title="Remove day"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {expandedDays.has(dayIdx) && (
                          <div className="bg-white p-4 space-y-2">
                            {dayPlan.activities.map((activity, actIdx) => (
                              <div
                                key={actIdx}
                                className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 group hover:bg-indigo-100 transition-colors"
                              >
                                <div className="flex items-center justify-center w-7 h-7 bg-indigo-600 text-white rounded-full text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                                  {actIdx + 1}
                                </div>
                                <span className="flex-1 text-sm text-gray-700 leading-relaxed">{activity}</span>
                                <button
                                  type="button"
                                  onClick={() => removeActivity(dayIdx, actIdx)}
                                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded-lg"
                                  title="Remove activity"
                                >
                                  <XIcon />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* IMPORTANT: footer submit is below, so no button here */}
              </form>

              {/* Modal Footer - submit button (FIXED) */}
            <div className="flex items-center justify-end gap-3 pr-8 pt-2 pb-5 ">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
              >
                Cancel
              </button>

              {/* Submit triggers form onSubmit */}
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none shadow-md shadow-blue-200 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={() => {
                  if (isSaving) return;
                  const formEl = document.querySelector('form');
                  if (formEl) (formEl as HTMLFormElement).requestSubmit?.();
                }}
              >
                
                {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Create Tour'}
              </button>
            </div>
            </div>

            
          </div>
        </div>
      )}

    </div>
  );
}
