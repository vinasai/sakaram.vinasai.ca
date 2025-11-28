import { useEffect, useState } from 'react';

type Tour = { id: number; name: string; location?: string; price?: string; description?: string; image?: string; duration?: string; rating?: number; popular?: boolean; reviews?: number; photos?: string[]; included?: string[]; excluded?: string[]; plan?: Array<string | string[] | {day: string; activities: string[]}> };

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function CollectionManager() {
  const [items, setItems] = useState<Tour[]>([]);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', price: '', description: '', image: '', duration: '', rating: '', popular: false as boolean, reviews: '', photos: '', included: '', excluded: '', plan: '' });
  const [formError, setFormError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  
  // New state for dynamic lists
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [excludedItems, setExcludedItems] = useState<string[]>([]);
  const [planItems, setPlanItems] = useState<Array<{day: string, activities: string[]}>>([]);
  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [currentActivity, setCurrentActivity] = useState('');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  // Handle device photo upload
  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
    
    // Check if adding these files would exceed the limit
    if (currentPhotos.length + files.length > 10) {
      setFormError(`You can only add ${10 - currentPhotos.length} more photo(s). Maximum 10 photos allowed.`);
      e.target.value = '';
      return;
    }

    const filesToProcess = Array.from(files);
    let processedCount = 0;
    const newPhotos: string[] = [];

    filesToProcess.forEach((file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormError(`Invalid file type: ${file.name}. Please upload JPG, PNG, WEBP, or GIF images.`);
        e.target.value = '';
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setFormError(`File too large: ${file.name}. Maximum size is 10MB.`);
        e.target.value = '';
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const photoData = reader.result as string;
        if (photoData && photoData.trim()) {
          newPhotos.push(photoData);
        }
        processedCount++;
        
        // Once all files are processed, update the form state once
        if (processedCount === filesToProcess.length && newPhotos.length > 0) {
          setForm(prev => {
            const existingPhotos = prev.photos ? prev.photos.split(',').filter(p => p && p.trim()) : [];
            const updatedPhotos = [...existingPhotos, ...newPhotos].filter(p => p && p.trim());
            
            // Set main image if not set
            const mainImage = prev.image || newPhotos[0];
            
            console.log('📷 Upload complete - Adding', newPhotos.length, 'new photo(s). Total:', updatedPhotos.length);
            
            return {
              ...prev,
              photos: updatedPhotos.join(','),
              image: mainImage
            };
          });
          setFormError('');
        }
      };
      
      reader.onerror = () => {
        setFormError(`Failed to read file: ${file.name}`);
        processedCount++;
      };
      
      reader.readAsDataURL(file);
    });

    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tours');
      console.debug('CollectionManager: read raw tours from localStorage:', raw ? `${raw.length} chars` : 'null');
      if (!raw) { setItems([]); return; }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
      else setItems([]);
    } catch (e) {
      console.warn('CollectionManager: failed to read/parse tours from localStorage', e);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (items.length === 0) {
        const existingRaw = localStorage.getItem('tours');
        try {
          const existing = existingRaw ? JSON.parse(existingRaw) : null;
          if (Array.isArray(existing) && existing.length > 0) {
            console.warn('CollectionManager: skipping write of empty tours to avoid overwriting existing data');
            return;
          }
        } catch (e) {
          // proceed to write if parse fails
        }
      }

      const payload = JSON.stringify(items);
      localStorage.setItem('tours', payload);
      console.debug('CollectionManager: wrote tours to localStorage, count=', items.length, 'chars=', payload.length);
      try { window.dispatchEvent(new CustomEvent('local-storage-updated', { detail: { key: 'tours' } })); } catch (e) {}
    } catch (e) {
      console.error('CollectionManager: failed to write tours to localStorage', e);
    }
  }, [items]);



  const addPhotoFromUrl = () => {
    const url = urlInput.trim();
    
    if (!url) {
      setFormError('Please enter an image URL');
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      setFormError('Invalid URL format. Please enter a valid image URL.');
      return;
    }
    
    // Check if URL looks like an image
    const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i;
    const isImageUrl = imageExtensions.test(url) || url.startsWith('data:image/');
    
    if (!isImageUrl) {
      setFormError('URL does not appear to be an image. Please use a direct image link.');
      return;
    }
    
    // Check photo count limit
    const currentPhotos = form.photos ? form.photos.split(',').filter(Boolean) : [];
    if (currentPhotos.length >= 10) {
      setFormError('Maximum 10 photos allowed per tour.');
      return;
    }
    
    setForm(prev => {
      const existingPhotos = prev.photos ? prev.photos.split(',').filter(Boolean) : [];
      const updatedPhotos = [...existingPhotos, url];
      const mainImage = prev.image || url;
      
      return {
        ...prev,
        photos: updatedPhotos.join(','),
        image: mainImage
      };
    });
    
    setUrlInput('');
    setFormError('');
  };

  const removePhoto = (index: number) => {
    setForm(prev => {
      const currentPhotos = prev.photos ? prev.photos.split(',').filter(p => p && p.trim()) : [];
      const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
      
      console.log('🗑️ Removing photo at index', index, '. Remaining:', updatedPhotos.length);
      
      return {
        ...prev,
        photos: updatedPhotos.join(',')
      };
    });
    
    setFormError('');
  };

  const addIncludedItem = () => {
    if (!includedInput.trim()) return;
    setIncludedItems([...includedItems, includedInput.trim()]);
    setIncludedInput('');
  };

  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const addExcludedItem = () => {
    if (!excludedInput.trim()) return;
    setExcludedItems([...excludedItems, excludedInput.trim()]);
    setExcludedInput('');
  };

  const removeExcludedItem = (index: number) => {
    setExcludedItems(excludedItems.filter((_, i) => i !== index));
  };

  const addActivityToDay = () => {
    if (!currentDay.trim() || !currentActivity.trim()) return;
    
    const existingDayIndex = planItems.findIndex(p => p.day.toLowerCase() === currentDay.trim().toLowerCase());
    
    if (existingDayIndex >= 0) {
      // Add activity to existing day
      const updated = [...planItems];
      updated[existingDayIndex].activities.push(currentActivity.trim());
      setPlanItems(updated);
    } else {
      // Create new day with activity
      setPlanItems([...planItems, { day: currentDay.trim(), activities: [currentActivity.trim()] }]);
    }
    
    // Only clear the activity, keep the day name so user can add more activities to the same day
    setCurrentActivity('');
  };

  const removeDay = (index: number) => {
    setPlanItems(planItems.filter((_, i) => i !== index));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...planItems];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== activityIndex);
    
    // Remove day if no activities left
    if (updated[dayIndex].activities.length === 0) {
      updated.splice(dayIndex, 1);
    }
    
    setPlanItems(updated);
  };

  const toggleDayExpanded = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  const formatPrice = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
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
    setForm({ name: '', location: '', price: '', description: '', image: '', duration: '', rating: '', popular: false, reviews: '', photos: '', included: '', excluded: '', plan: '' });
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
    setShowModal(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const photosArrForValidation = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
    if (photosArrForValidation.length === 0 && !form.image) {
      setFormError('Please provide at least one photo by uploading or entering an image URL.');
      return;
    }

    const finalPrice = form.price ? `$${form.price}` : '';

    const newItem: Tour = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      price: finalPrice,
      description: form.description,
      image: form.image,
      duration: form.duration,
      rating: form.rating ? parseFloat(form.rating) : undefined,
      popular: !!form.popular,
      reviews: form.reviews ? Number(form.reviews) : undefined,
      photos: (() => {
        const arr = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
        if (arr.length === 0 && form.image) return [String(form.image)];
        return arr.length ? arr : undefined;
      })(),
      included: includedItems.length > 0 ? includedItems : undefined,
      excluded: excludedItems.length > 0 ? excludedItems : undefined,
      plan: planItems.length > 0 ? planItems : undefined
    };
    setItems((s) => [newItem, ...s]);
    setForm({ name: '', location: '', price: '', description: '', image: '', duration: '', rating: '', popular: false, reviews: '', photos: '', included: '', excluded: '', plan: '' });
    setFormError('');
    setUrlInput('');
    setIncludedItems([]);
    setExcludedItems([]);
    setPlanItems([]);
    setExpandedDays(new Set());
    setShowModal(false);
  };

  const startEdit = (t: Tour) => {
    setEditing(t);
    
    // Remove $ from price for editing
    const priceValue = t.price ? t.price.replace(/[$,]/g, '') : '';
    
    setForm({
      name: t.name,
      location: t.location || '',
      price: priceValue,
      description: t.description || '',
      image: t.image || '',
      duration: t.duration || '',
      rating: t.rating ? String(t.rating) : '',
      popular: !!t.popular,
      reviews: t.reviews ? String(t.reviews) : '',
      photos: (t.photos && Array.isArray(t.photos)) ? t.photos.filter(p => p && p.trim()).join(',') : '',
      included: '',
      excluded: '',
      plan: ''
    });
    setIncludedItems(t.included && Array.isArray(t.included) ? t.included : []);
    setExcludedItems(t.excluded && Array.isArray(t.excluded) ? t.excluded : []);
    
    // Parse plan structure
    if (t.plan && Array.isArray(t.plan)) {
      const parsed: Array<{day: string, activities: string[]}> = [];
      t.plan.forEach((item, idx) => {
        // Check if it's the new format with day and activities
        if (item && typeof item === 'object' && 'day' in item && 'activities' in item) {
          parsed.push(item as {day: string, activities: string[]});
        } else if (Array.isArray(item)) {
          parsed.push({ day: `Day ${idx + 1}`, activities: item });
        } else {
          parsed.push({ day: `Day ${idx + 1}`, activities: [String(item)] });
        }
      });
      setPlanItems(parsed);
    } else {
      setPlanItems([]);
    }
    
    setFormError('');
    setUrlInput('');
    setIncludedInput('');
    setExcludedInput('');
    setCurrentDay('');
    setCurrentActivity('');
    setExpandedDays(new Set(Array.from({ length: t.plan?.length || 0 }, (_, i) => i)));
    setShowModal(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const photosArrForValidation = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
    if (photosArrForValidation.length === 0 && !form.image) {
      setFormError('Please provide at least one photo by uploading or entering an image URL.');
      return;
    }

    const finalPrice = form.price ? `$${form.price}` : '';

    setItems((s) =>
      s.map(i =>
        i.id === editing.id
          ? {
              ...i,
              name: form.name,
              location: form.location,
              price: finalPrice,
              description: form.description,
              image: form.image,
              duration: form.duration,
              rating: form.rating ? parseFloat(form.rating) : undefined,
              popular: !!form.popular,
              reviews: form.reviews ? Number(form.reviews) : undefined,
              photos: (() => {
                const arr = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
                if (arr.length === 0 && form.image) return [String(form.image)];
                return arr.length ? arr : undefined;
              })(),
              included: includedItems.length > 0 ? includedItems : undefined,
              excluded: excludedItems.length > 0 ? excludedItems : undefined,
              plan: planItems.length > 0 ? planItems : undefined
            }
          : i
      )
    );
    setEditing(null);
    setForm({ name: '', location: '', price: '', description: '', image: '', duration: '', rating: '', popular: false, reviews: '', photos: '', included: '', excluded: '', plan: '' });
    setFormError('');
    setUrlInput('');
    setIncludedItems([]);
    setExcludedItems([]);
    setPlanItems([]);
    setExpandedDays(new Set());
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', location: '', price: '', description: '', image: '', duration: '', rating: '', popular: false, reviews: '', photos: '', included: '', excluded: '', plan: '' });
    setUrlInput('');
    setIncludedItems([]);
    setExcludedItems([]);
    setPlanItems([]);
    setExpandedDays(new Set());
  };

  const remove = (id: number) => {
    if (!confirm('Delete this tour?')) return;
    setItems((s) => s.filter(i => i.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Tours</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your tour packages and experiences</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusIcon />
          <span className="font-medium">Add Tour</span>
        </button>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4 text-gray-400">
              <MapIcon />
            </div>
            <p className="text-gray-600 mb-4">No tours available yet</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first tour
            </button>
          </div>
        )}
        
        {items.map(i => (
          <div key={i.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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

              {i.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{i.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {i.price && (
                  <span className="text-lg font-semibold text-blue-600">{i.price}</span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => startEdit(i)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header - Enhanced */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Tour' : 'Create New Tour'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editing ? 'Update your tour details' : 'Add a new tour package to your collection'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={editing ? saveEdit : handleAdd} className="p-8 space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapIcon />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Basic Information</h4>
                      <p className="text-xs text-gray-500">Essential tour details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., Paris City Tour"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <LocationIcon />
                        </div>
                        <input
                          value={form.location}
                          onChange={e => setForm({ ...form, location: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Paris, France"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (USD)
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
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <ClockIcon />
                        </div>
                        <input
                          value={form.duration}
                          onChange={e => setForm({ ...form, duration: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="4-5 hours"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-500">
                          <StarIcon />
                        </div>
                        <input
                          value={form.rating}
                          onChange={e => setForm({ ...form, rating: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="4.9"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="inline-flex items-center cursor-pointer px-4 py-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all">
                        <input 
                          type="checkbox" 
                          checked={!!form.popular} 
                          onChange={e => setForm({ ...form, popular: e.target.checked })} 
                          className="form-checkbox h-5 w-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500" 
                        />
                        <span className="ml-3 text-sm font-semibold text-gray-700">🔥 Hot Deal</span>
                      </label>

                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reviews</label>
                        <input 
                          type="number" 
                          min={0} 
                          value={form.reviews} 
                          onChange={e => setForm({ ...form, reviews: e.target.value })} 
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your tour experience..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* Photos Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      <ImageIcon />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Tour Photos</h4>
                      <p className="text-xs text-gray-500">Add 1-10 photos to showcase your tour</p>
                    </div>
                  </div>

                  {/* Photo Upload Options */}
                  <div className="space-y-4">
                    {/* Device Upload Button */}
                    <label className="flex items-center justify-center gap-3 w-full border-3 border-dashed border-purple-300 rounded-xl px-6 py-5 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group">
                      <UploadIcon className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                          Upload from Device
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">JPG, PNG, WEBP, GIF up to 10MB (Max 10 photos)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handlePhotoFile}
                        className="hidden"
                      />
                    </label>

                    {/* OR Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <LinkIcon />
                        </div>
                        <input
                          type="url"
                          value={urlInput}
                          onChange={e => setUrlInput(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPhotoFromUrl())}
                          className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Paste image URL here..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addPhotoFromUrl}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add URL
                      </button>
                    </div>

                  </div>
                  
                  {/* Photo Grid */}
                  {(() => {
                    const photos = form.photos ? form.photos.split(',').filter(p => p && p.trim()) : [];
                    console.log('📸 Photo Grid Render - Photos count:', photos.length, 'First 100 chars:', form.photos?.substring(0, 100));
                    
                    return photos.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-700">
                            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} Added
                          </p>
                          <p className="text-xs text-gray-500">Click on a photo to remove it</p>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                          {photos.map((photo, idx) => (
                            <div key={`photo-${idx}-${photo.substring(0, 20)}`} className="relative group">
                              <div className="w-full aspect-square overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-gray-100 flex items-center justify-center">
                                {photo ? (
                                  <img 
                                    src={photo} 
                                    alt={`Photo ${idx + 1}`} 
                                    className="w-full h-full object-cover" 
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent && !parent.querySelector('.error-placeholder')) {
                                        const placeholder = document.createElement('div');
                                        placeholder.className = 'error-placeholder flex flex-col items-center justify-center h-full text-gray-500 text-xs text-center p-3';
                                        placeholder.innerHTML = `
                                          <svg class="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                          <span>Image failed</span>
                                        `;
                                        parent.appendChild(placeholder);
                                      }
                                      console.error('Failed to load image at index', idx, 'URL length:', photo?.length);
                                    }}
                                  />
                                ) : (
                                  <div className="text-gray-400 text-xs text-center p-2">No image</div>
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
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {formError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-700 font-medium">{formError}</span>
                    </div>
                  )}
                </div>

                {/* What's Included/Excluded Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* What's Included */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        <CheckIcon />
                      </div>
                      <h4 className="font-semibold text-gray-900">What's Included</h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={includedInput}
                        onChange={e => setIncludedInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addIncludedItem())}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="e.g., Professional guide"
                      />
                      <button
                        type="button"
                        onClick={addIncludedItem}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {includedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 group hover:bg-green-100 transition-colors">
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

                  {/* What's Excluded */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-red-100">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        <XIcon />
                      </div>
                      <h4 className="font-semibold text-gray-900">What's Excluded</h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={excludedInput}
                        onChange={e => setExcludedInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addExcludedItem())}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="e.g., Flight tickets"
                      />
                      <button
                        type="button"
                        onClick={addExcludedItem}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {excludedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 group hover:bg-red-100 transition-colors">
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

                {/* Tour Plan Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <CalendarIcon />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Tour Itinerary</h4>
                      <p className="text-xs text-gray-500">Plan activities for each day</p>
                    </div>
                  </div>
                  
                  {/* Add Activity Form */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-xl p-5 space-y-4">
                    {/* Day Selector - Quick Buttons + Custom Input */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">Select Day</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dayNum) => {
                          const dayName = `Day ${dayNum}`;
                          const isSelected = currentDay === dayName;
                          const hasActivities = planItems.some(p => p.day === dayName);
                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => setCurrentDay(dayName)}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                                  : hasActivities
                                  ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 border-2 border-indigo-300'
                                  : 'bg-white text-gray-700 hover:bg-indigo-100 border-2 border-gray-200'
                              }`}
                            >
                              {dayName}
                              {hasActivities && !isSelected && (
                                <span className="ml-1 text-xs">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          value={currentDay}
                          onChange={e => setCurrentDay(e.target.value)}
                          className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                          placeholder="Or enter custom day (e.g., Day 11, Day 12)"
                        />
                      </div>
                    </div>

                    {/* Activity Input */}
                    <div className="flex gap-3">
                      <input
                        value={currentActivity}
                        onChange={e => setCurrentActivity(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addActivityToDay())}
                        className="flex-1 border-2 border-indigo-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        placeholder="Activity (e.g., Visit Eiffel Tower, Lunch at local restaurant)"
                      />
                      <button
                        type="button"
                        onClick={addActivityToDay}
                        disabled={!currentDay.trim() || !currentActivity.trim()}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold text-sm shadow-sm whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon />
                        Add Activity
                      </button>
                    </div>
                  </div>

                  {/* Days List */}
                  <div className="space-y-3">
                    {planItems.map((dayPlan, dayIdx) => (
                      <div key={dayIdx} className="border-2 border-indigo-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Day Header */}
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

                        {/* Activities List (Collapsible) */}
                        {expandedDays.has(dayIdx) && (
                          <div className="bg-white p-4 space-y-2">
                            {dayPlan.activities.map((activity, actIdx) => (
                              <div key={actIdx} className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 group hover:bg-indigo-100 transition-colors">
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

              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-4 px-8 py-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={editing ? saveEdit : handleAdd}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                {editing ? ' Save Changes' : ' Create Tour'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}